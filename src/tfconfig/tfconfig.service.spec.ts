import { Test, TestingModule } from '@nestjs/testing';
import { TFConfigService } from './tfconfig.service';
import { ConfigService } from '@nestjs/config';

describe('TFConfigService', () => {
  let tfConfigService: TFConfigService;
  let configServiceMock: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockFn = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TFConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: mockFn,
            getOrThrow: mockFn,
          },
        },
      ],
    }).compile();

    tfConfigService = module.get<TFConfigService>(TFConfigService);
    configServiceMock = module.get<jest.Mocked<ConfigService>>(ConfigService);
  });

  it('should be defined', () => {
    expect(tfConfigService).toBeDefined();
  });

  describe('environment', () => {
    it('should call the ConfigService', () => {
      tfConfigService.environment;
      expect(configServiceMock.get).toHaveBeenCalled();
    });

    it('should return the value from the ConfigService if defined', () => {
      const expected = 'development';
      configServiceMock.get.mockReturnValue(expected);
      const actual = tfConfigService.environment;
      expect(actual).toEqual(expected);
    });

    it('should return production if the ConfigService returns undefined', () => {
      const expected = 'production';
      configServiceMock.get.mockReturnValue(undefined);
      const actual = tfConfigService.environment;
      expect(actual).toEqual(expected);
    });
  });

  describe('databaseUrl', () => {
    it('should call the ConfigService', () => {
      configServiceMock.get.mockReturnValue(
        'postgres://localhost:5432/tfconfig',
      );
      tfConfigService.databaseUrl;
      expect(configServiceMock.get).toHaveBeenCalled();
    });

    it('should return the value from the ConfigService if defined', () => {
      const expected = 'postgres://localhost:5432/tfconfig';
      configServiceMock.get.mockReturnValue(expected);
      const actual = tfConfigService.databaseUrl;
      expect(actual).toEqual(expected);
    });

    it('should throw an error if the ConfigService returns undefined', () => {
      configServiceMock.get.mockReturnValue(undefined);
      expect(() => tfConfigService.databaseUrl).toThrow();
    });

    it('throws an error if the ConfigService returns an invalid URL', () => {
      configServiceMock.get.mockReturnValue('invalid-url');
      expect(() => tfConfigService.databaseUrl).toThrow();
    });
  });
});
