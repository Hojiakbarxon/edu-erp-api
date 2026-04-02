import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from 'src/users/entities/user.entity'
import { UnauthorizedException, BadRequestException } from '@nestjs/common'
import * as cacheControl from 'src/utils/cache-control'
import * as mailService from 'src/utils/mail-service'
import { Crypto } from 'src/utils/Crypto'

const mockUserRepo = {
  findOne: jest.fn(),
  update: jest.fn(),
}

jest.mock('src/utils/cache-control', () => ({
  setCache: jest.fn(),
  getCache: jest.fn(),
  delCache: jest.fn(),
}))

jest.mock('src/utils/mail-service', () => ({
  sendMail: jest.fn().mockResolvedValue({}),
}))

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should throw 401 if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null)
      const mockRes = { clearCookie: jest.fn() } as any
      await expect(service.login({ email: 'wrong@test.com', password: '123' }, mockRes))
        .rejects.toThrow(UnauthorizedException)
    })

    it('should throw 401 if password is wrong', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 1, email: 'test@test.com', password: 'hashed' })
      jest.spyOn(Crypto, 'compare').mockResolvedValue(false)
      const mockRes = { clearCookie: jest.fn() } as any
      await expect(service.login({ email: 'test@test.com', password: 'wrong' }, mockRes))
        .rejects.toThrow(UnauthorizedException)
    })

    it('should send OTP and return success when credentials are correct', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 1, email: 'test@test.com', password: 'hashed' })
      jest.spyOn(Crypto, 'compare').mockResolvedValue(true)
      const mockRes = { clearCookie: jest.fn() } as any

      const result = await service.login({ email: 'test@test.com', password: 'correct' }, mockRes)
      expect(result.statusCode).toBe(200)
      expect(cacheControl.setCache).toHaveBeenCalled()
      expect(mailService.sendMail).toHaveBeenCalled()
    })
  })

  describe('confirmOtp', () => {
    it('should throw 400 if OTP is wrong', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 1, email: 'test@test.com' })
      ;(cacheControl.getCache as jest.Mock).mockReturnValue('123456')
      const mockRes = {} as any

      await expect(service.confirmOtp(mockRes, { email: 'test@test.com', otp: 'wrong' }))
        .rejects.toThrow(BadRequestException)
    })

    it('should throw 400 if OTP is expired', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 1, email: 'test@test.com' })
      ;(cacheControl.getCache as jest.Mock).mockReturnValue(undefined)
      const mockRes = {} as any

      await expect(service.confirmOtp(mockRes, { email: 'test@test.com', otp: '123456' }))
        .rejects.toThrow(BadRequestException)
    })
  })

  describe('resetPassword', () => {
    it('should throw 400 if reset OTP is wrong', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 1, email: 'test@test.com' })
      ;(cacheControl.getCache as jest.Mock).mockReturnValue('654321')

      await expect(service.resetPassword({
        email: 'test@test.com',
        otp: 'wrong',
        new_password: 'newpass'
      })).rejects.toThrow(BadRequestException)
    })

    it('should reset password successfully', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 1, email: 'test@test.com' })
      ;(cacheControl.getCache as jest.Mock).mockReturnValue('654321')
      mockUserRepo.update.mockResolvedValue({})
      jest.spyOn(Crypto, 'hash').mockResolvedValue('newhashed')

      const result = await service.resetPassword({
        email: 'test@test.com',
        otp: '654321',
        new_password: 'newpass'
      })
      expect(result.statusCode).toBe(200)
      expect(cacheControl.delCache).toHaveBeenCalled()
    })
  })
})