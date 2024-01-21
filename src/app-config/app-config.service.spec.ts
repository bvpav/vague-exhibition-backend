import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigService } from './app-config.service';
import { ConfigService } from '@nestjs/config';

describe('AppConfigService', () => {
  let appConfigService: AppConfigService;
  let configServiceMock: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockFn = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: mockFn,
            getOrThrow: mockFn,
          },
        },
      ],
    }).compile();

    appConfigService = module.get<AppConfigService>(AppConfigService);
    configServiceMock = module.get<jest.Mocked<ConfigService>>(ConfigService);
  });

  it('should be defined', () => {
    expect(appConfigService).toBeDefined();
  });

  describe('environment', () => {
    it('should call the ConfigService', () => {
      appConfigService.environment;
      expect(configServiceMock.get).toHaveBeenCalled();
    });

    it('should return the value from the ConfigService if defined', () => {
      const expected = 'development';
      configServiceMock.get.mockReturnValue(expected);
      const actual = appConfigService.environment;
      expect(actual).toEqual(expected);
    });

    it('should return production if the ConfigService returns undefined', () => {
      const expected = 'production';
      configServiceMock.get.mockReturnValue(undefined);
      const actual = appConfigService.environment;
      expect(actual).toEqual(expected);
    });
  });

  describe('databaseUrl', () => {
    it('should call the ConfigService', () => {
      configServiceMock.get.mockReturnValue('postgres://localhost:5432/db');
      appConfigService.databaseUrl;
      expect(configServiceMock.get).toHaveBeenCalled();
    });

    it('should return the value from the ConfigService if defined', () => {
      const expected = 'postgres://localhost:5432/db';
      configServiceMock.get.mockReturnValue(expected);
      const actual = appConfigService.databaseUrl;
      expect(actual).toEqual(expected);
    });

    it('should throw an error if the ConfigService returns undefined', () => {
      configServiceMock.get.mockReturnValue(undefined);
      expect(() => appConfigService.databaseUrl).toThrow();
    });

    it('throws an error if the ConfigService returns an invalid URL', () => {
      configServiceMock.get.mockReturnValue('invalid-url');
      expect(() => appConfigService.databaseUrl).toThrow();
    });
  });

  describe('s3AccessKeyId', () => {
    it('should call the ConfigService', () => {
      configServiceMock.get.mockReturnValue('1234567890');
      appConfigService.s3AccessKeyId;
      expect(configServiceMock.get).toHaveBeenCalled();
    });

    it('should return the value from the ConfigService if defined', () => {
      const expected = '1234567890';
      configServiceMock.get.mockReturnValue(expected);
      const actual = appConfigService.s3AccessKeyId;
      expect(actual).toEqual(expected);
    });

    it('throws an error if the ConfigService returns undefined', () => {
      configServiceMock.get.mockReturnValue(undefined);
      expect(() => appConfigService.s3AccessKeyId).toThrow();
    });

    it('throws an error if the ConfigService returns an empty string', () => {
      configServiceMock.get.mockReturnValue('');
      expect(() => appConfigService.s3AccessKeyId).toThrow();
    });

    it('throws an error if the ConfigService returns a string with only whitespace', () => {
      configServiceMock.get.mockReturnValue('  ');
      expect(() => appConfigService.s3AccessKeyId).toThrow();
    });
  });
});
