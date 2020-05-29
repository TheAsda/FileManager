import 'reflect-metadata';
import { ILogManager } from '@fm/common';
import { Container } from 'inversify';
import { LogManager } from 'common/managers/LogManager';

let container: Container;
const loggerSymbol = Symbol.for('Logger');

describe('Test container', () => {
  beforeAll(() => {
    container = new Container();
    container.bind<ILogManager>(loggerSymbol).to(LogManager);
  });

  test('Logger exists', () => {
    const logger = container.get(loggerSymbol);
    expect(logger).not.toBe(null);
  });
});
