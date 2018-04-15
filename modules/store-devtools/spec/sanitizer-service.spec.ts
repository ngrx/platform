import { DevToolsSanitizerService } from '../src';
import { ActionSanitizer, StateSanitizer } from '../src/config';

describe('Devtools Sanitizer Service', () => {
  describe('should initialize', () => {
    it('with not sanitizers', () => {
      // Arrange

      // Act
      const sut = new DevToolsSanitizerService();

      // Assert
      expect(sut).toBeDefined();
    });

    it('and register a single action sanitizer', () => {
      // Arrange
      const key = 'INIT_0';
      const sanitizer: ActionSanitizer = (action, id) => {
        return action;
      };
      const expected = {
        [key]: sanitizer,
      };

      // Act
      const sut = new DevToolsSanitizerService(sanitizer);

      // Assert
      expect(sut.actionSanitizers).toEqual(expected);
    });

    it('and register multiple action sanitizers', () => {
      // Arrange
      const key = '';
      const sanitizer: ActionSanitizer[] = [
        (action, id) => action,
        (action, id) => ({ ...action, payload: 'foobar' }),
      ];
      const expected = {
        INIT_0: sanitizer[0],
        INIT_1: sanitizer[1],
      };

      // Act
      const sut = new DevToolsSanitizerService(sanitizer);

      // Assert
      expect(sut.actionSanitizers).toEqual(expected);
    });

    it('and register a single state sanitizer', () => {
      // Arrange
      const key = 'INIT_0';
      const sanitizer: StateSanitizer = (state, id) => {
        return state;
      };
      const expected = {
        [key]: sanitizer,
      };

      // Act
      const sut = new DevToolsSanitizerService(undefined, sanitizer);

      // Assert
      expect(sut.stateSanitizers).toEqual(expected);
    });

    it('and register multiple state sanitizers', () => {
      // Arrange
      const sanitizer: StateSanitizer[] = [
        (state, id) => state,
        (state, id) => ({ ...state, stateProp: 'foobar' }),
      ];
      const expected = {
        INIT_0: sanitizer[0],
        INIT_1: sanitizer[1],
      };

      // Act
      const sut = new DevToolsSanitizerService(undefined, sanitizer);

      // Assert
      expect(sut.stateSanitizers).toEqual(expected);
    });

    it('and set configuration', () => {
      // Arrange
      const expected = {
        loggingEnabled: true,
        logger: console.log,
      };

      // Act
      const sut = new DevToolsSanitizerService(undefined, undefined, expected);

      // Assert
      expect(sut.config).toEqual(expected);
    });

    it('and register multiple sanitizers and configuration', () => {
      // Arrange
      const stateSanitizer: StateSanitizer[] = [
        (state, id) => state,
        (state, id) => ({ ...state, stateProp: 'foobar' }),
      ];
      const expectedConfig = {
        loggingEnabled: true,
        logger: () => {},
      };
      const expectedStateSantiziers = {
        INIT_0: stateSanitizer[0],
        INIT_1: stateSanitizer[1],
      };
      const actionSanitizer: ActionSanitizer = (action, id) => {
        return action;
      };
      const expectedActionSanitizer = {
        INIT_0: actionSanitizer,
      };

      // Act
      const sut = new DevToolsSanitizerService(
        actionSanitizer,
        stateSanitizer,
        expectedConfig
      );

      // Assert
      expect(sut.actionSanitizers).toEqual(expectedActionSanitizer);
      expect(sut.stateSanitizers).toEqual(expectedStateSantiziers);
      expect(sut.config).toEqual(expectedConfig);
    });
  });

  describe('sanitizeAction', () => {
    it('should sanitize and call logger when logger enabled', () => {
      // Arrange
      const action = { type: 'fake', payload: 'foo' };
      const expected = { type: 'fake', payload: 'bar' };

      const actionSanitizers: ActionSanitizer[] = [
        (action, id) => {
          return { ...action, payload: 'fake' };
        },
        (action, id) => {
          return { ...action, payload: 'bar' };
        },
      ];
      const stateSanitizers: StateSanitizer[] = [
        (state, id) => state,
        (state, id) => ({ ...state, stateProp: 'foobar' }),
      ];
      const config = {
        loggingEnabled: true,
        logger: jasmine.createSpy('logger'),
      };
      const service = new DevToolsSanitizerService(
        actionSanitizers,
        stateSanitizers,
        config
      );

      // Act
      const actual = service.sanitizeAction(action, 0);

      // Assert
      expect(actual).toEqual(expected);
      expect(config.logger).toHaveBeenCalled();
    });

    it('should sanitize and call logger when logger disabled', () => {
      // Arrange
      const action = { type: 'fake', payload: 'foo' };
      const expected = { type: 'fake', payload: 'bar' };

      const actionSanitizers: ActionSanitizer[] = [
        (action, id) => {
          return { ...action, payload: 'fake' };
        },
        (action, id) => {
          return { ...action, payload: 'bar' };
        },
      ];
      const stateSanitizers: StateSanitizer[] = [
        (state, id) => state,
        (state, id) => ({ ...state, stateProp: 'foobar' }),
      ];
      const config = {
        loggingEnabled: false,
        logger: jasmine.createSpy('logger'),
      };
      const service = new DevToolsSanitizerService(
        actionSanitizers,
        stateSanitizers,
        config
      );

      // Act
      const actual = service.sanitizeAction(action, 0);

      // Assert
      expect(actual).toEqual(expected);
      expect(config.logger).not.toHaveBeenCalled();
    });
  });

  describe('sanitizeState', () => {
    it('should sanitize and call logger when logger enabled', () => {
      // Arrange
      const state = { test: 'fake', stateProp: 'foo' };
      const expected = { test: 'fake', stateProp: 'foobar' };

      const actionSanitizers: ActionSanitizer[] = [
        (action, id) => {
          return { ...action, payload: 'fake' };
        },
        (action, id) => {
          return { ...action, payload: 'bar' };
        },
      ];
      const stateSanitizers: StateSanitizer[] = [
        (state, id) => state,
        (state, id) => ({ ...state, stateProp: 'foobar' }),
      ];
      const config = {
        loggingEnabled: true,
        logger: jasmine.createSpy('logger'),
      };
      const service = new DevToolsSanitizerService(
        actionSanitizers,
        stateSanitizers,
        config
      );

      // Act
      const actual = service.sanitizeState(state, 0);

      // Assert
      expect(actual).toEqual(expected);
      expect(config.logger).toHaveBeenCalled();
    });

    it('should sanitize and call logger when logger disabled', () => {
      // Arrange
      const state = { test: 'fake', stateProp: 'foo' };
      const expected = { test: 'fake', stateProp: 'foobar' };

      const actionSanitizers: ActionSanitizer[] = [
        (action, id) => {
          return { ...action, payload: 'fake' };
        },
        (action, id) => {
          return { ...action, payload: 'bar' };
        },
      ];
      const stateSanitizers: StateSanitizer[] = [
        (state, id) => state,
        (state, id) => ({ ...state, stateProp: 'foobar' }),
      ];
      const config = {
        loggingEnabled: false,
        logger: jasmine.createSpy('logger'),
      };
      const service = new DevToolsSanitizerService(
        actionSanitizers,
        stateSanitizers,
        config
      );

      // Act
      const actual = service.sanitizeState(state, 0);

      // Assert
      expect(actual).toEqual(expected);
      expect(config.logger).not.toHaveBeenCalled();
    });
  });

  describe('registerActionSanitizer', () => {
    it('should register a sanitizer', () => {
      // Arrange
      const key = 'SANITIZER_1';
      const sanitizer: ActionSanitizer = (action, id) => {
        return action;
      };
      const expected = {
        [key]: sanitizer,
      };
      const sut = new DevToolsSanitizerService(undefined);

      // Act
      sut.registerActionSanitizer(key, sanitizer);

      // Assert
      expect(sut.actionSanitizers).toEqual(expected);
    });
  });

  describe('registerStateSanitizer', () => {
    it('should register a sanitizer', () => {
      // Arrange
      const key = 'SANITIZER_1';
      const sanitizer: StateSanitizer = (state, id) => {
        return state;
      };
      const expected = {
        [key]: sanitizer,
      };
      const sut = new DevToolsSanitizerService(undefined);

      // Act
      sut.registerStateSanitizer(key, sanitizer);

      // Assert
      expect(sut.stateSanitizers).toEqual(expected);
    });
  });

  describe('deregisterActionSanitizer', () => {
    it('should register a sanitizer', () => {
      // Arrange
      const key = 'SANITIZER_1';
      const sanitizer: ActionSanitizer = (action, id) => {
        return action;
      };
      const expected = {};
      const sut = new DevToolsSanitizerService();
      sut.registerActionSanitizer(key, sanitizer);

      // Act
      sut.deregisterActionSanitizer(key);

      // Assert
      expect(sut.actionSanitizers).toEqual(expected);
    });
  });

  describe('deregisterStateSanitizer', () => {
    it('should register a sanitizer', () => {
      // Arrange
      const key = 'SANITIZER_1';
      const sanitizer: StateSanitizer = (state, id) => {
        return state;
      };
      const expected = {};
      const sut = new DevToolsSanitizerService();
      sut.registerStateSanitizer(key, sanitizer);

      // Act
      sut.deregisterStateSanitizer(key);

      // Assert
      expect(sut.stateSanitizers).toEqual(expected);
    });
  });
});
