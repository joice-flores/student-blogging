export const environment = {
  mongodb: {
    errors: {
      mongoUri: 'MONGODB_URI must be a valid URL'
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
