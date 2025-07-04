import log from 'loglevel';

interface ExtendedLogger extends log.RootLogger {
  separator: (message: string) => void;
}

const extendedLog: ExtendedLogger = log as ExtendedLogger;

// Set the logging level based on the environment
if (process.env.NODE_ENV === 'production') {
  log.setLevel('warn');
} else {
  log.setLevel('debug');
}

// Add a method to log a separator line
extendedLog.separator = (message: string) => {
  log.debug(`\n--- ${message} ---\n`);
};

export default extendedLog;