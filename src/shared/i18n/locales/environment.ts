export const environment = {
  mongodb: {
    errors: {
      mongoUri: 'MONGODB_URI must be a valid URL',
      connected: 'Database not connected'
    },
    success: {
      connected: 'MongoDB connected successfully'
    }
  },
  grafana: {
    errors: {
      serverRootUrl: 'GF_SERVER_ROOT_URL must be a valid URL'
    }
  },
  zod: {
    errors: {
      envVariables: 'Error in environment variables:',
      checkEnvFile: 'Check your .env file'
    },
    success: {
      envValidated: 'Environment variables successfully validated'
    }
  }
};
