import { describe, it, expect } from '@jest/globals';
import * as Utils from '../../utils';
import { logger } from '../../utils/logger';
import { API_URL } from '../../utils/constants';

describe('Utils Index', () => {
    it('should export constants', () => {
        expect(Utils.API_URL).toBe(API_URL);
        expect(Utils.USER).toBeDefined();
        expect(Utils.TOKEN).toBeDefined();
        expect(Utils.CART).toBeDefined();
    });

    it('should export logger', () => {
        expect(Utils.logger).toBeDefined();
        expect(Utils.logger).toBe(logger);
    });
});
