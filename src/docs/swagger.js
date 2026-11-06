export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'DivineIT Trading DSS API',
    version: '1.0.0',
    description: 'Interactive API documentation for DivineIT Trading Decision Support System (DSS) backend.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
  ],
  tags: [
    { name: 'System', description: 'System health and status endpoints' },
    { name: 'Information', description: 'Market information and news management' },
    { name: 'Signal', description: 'Trading signals management' },
    { name: 'Market', description: 'Market prices and technical analytics' },
  ],
  paths: {
    '/': {
      get: {
        tags: ['System'],
        summary: 'Root welcome endpoint',
        responses: {
          200: {
            description: 'API is running',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'DivineIT Trading DSS API is running' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check endpoint',
        responses: {
          200: {
            description: 'Service health status',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'OK' },
                    message: { type: 'string', example: 'DivineIT Trading DSS API is running' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/information': {
      get: {
        tags: ['Information'],
        summary: 'Get all information entries',
        responses: {
          200: {
            description: 'List of all information entries',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Information' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Information'],
        summary: 'Create a new information entry',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateInfoInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Information' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation error (missing title or body)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/information/new': {
      get: {
        tags: ['Information'],
        summary: 'Get recent information entries (past 7 days)',
        responses: {
          200: {
            description: 'List of recent information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Information' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/information/{id}': {
      get: {
        tags: ['Information'],
        summary: 'Get information detail by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Information ID',
            example: 1,
          },
        ],
        responses: {
          200: {
            description: 'Information found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Information' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Information not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Information'],
        summary: 'Update information entry by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Information ID',
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateInfoInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Information' },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Information'],
        summary: 'Delete information entry by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Information ID',
            example: 1,
          },
        ],
        responses: {
          200: {
            description: 'Deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Information' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/signal': {
      get: {
        tags: ['Signal'],
        summary: 'Get all trading signals',
        responses: {
          200: {
            description: 'List of signals',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Signal' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Signal'],
        summary: 'Create a new trading signal',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateSignalInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Signal created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Signal' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required fields (symbol, type, entry_price)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/signal/my': {
      get: {
        tags: ['Signal'],
        summary: 'Get signals created by authenticated user',
        responses: {
          200: {
            description: 'List of user signals',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Signal' },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized (requires authentication)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/signal/sender/{sender_id}': {
      get: {
        tags: ['Signal'],
        summary: 'Get signals by sender/user ID',
        parameters: [
          {
            name: 'sender_id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'User ID of sender',
            example: 1,
          },
        ],
        responses: {
          200: {
            description: 'Signals from sender',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Signal' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/signal/{id}': {
      get: {
        tags: ['Signal'],
        summary: 'Get signal detail by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Signal ID',
            example: 1,
          },
        ],
        responses: {
          200: {
            description: 'Signal details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Signal' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Signal not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Signal'],
        summary: 'Update signal by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Signal ID',
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateSignalInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Signal updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Signal' },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Signal'],
        summary: 'Delete signal by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Signal ID',
            example: 1,
          },
        ],
        responses: {
          200: {
            description: 'Signal deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Signal deleted successfully' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/market/summary/{symbol}': {
      get: {
        tags: ['Market'],
        summary: 'Get market price summary for a crypto ticker',
        parameters: [
          {
            name: 'symbol',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Coin ticker (e.g. BTC, ETH)',
            example: 'BTC',
          },
        ],
        responses: {
          200: {
            description: 'Market summary found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/MarketSummary' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Symbol not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/market/analytic/{symbol}': {
      get: {
        tags: ['Market'],
        summary: 'Get technical market analytics (EMA 50, Trend, Distance)',
        parameters: [
          {
            name: 'symbol',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Coin ticker (e.g. BTC, ETH)',
            example: 'BTC',
          },
        ],
        responses: {
          200: {
            description: 'Market analytics found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/MarketAnalytic' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Symbol not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Information: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Bitcoin Halving Event Update' },
          body: { type: 'string', example: 'Detailed analysis of post-halving network difficulty...' },
          sender_id: { type: 'integer', nullable: true, example: 1 },
          sender: { type: 'string', example: 'System' },
          created_at: { type: 'string', format: 'date-time', example: '2026-11-06T00:00:00.000Z' },
          updated_at: { type: 'string', format: 'date-time', nullable: true, example: null },
        },
      },
      CreateInfoInput: {
        type: 'object',
        required: ['title', 'body'],
        properties: {
          title: { type: 'string', example: 'Market Alert: Volatility Expected' },
          body: { type: 'string', example: 'CPI report scheduled for release at 13:30 UTC.' },
        },
      },
      UpdateInfoInput: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Updated Alert Title' },
          body: { type: 'string', example: 'Updated message content.' },
        },
      },
      Signal: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          symbol: { type: 'string', example: 'BTC' },
          type: { type: 'string', enum: ['Long', 'Short'], example: 'Long' },
          entry_price: { type: 'number', example: 67500.5 },
          sl_price: { type: 'number', example: 66000.0 },
          tp_price: { type: 'number', example: 71000.0 },
          status: { type: 'string', enum: ['active', 'running', 'cancelled', 'profit', 'loss'], example: 'active' },
          sender_id: { type: 'integer', nullable: true, example: 1 },
          sender: { type: 'string', example: 'System' },
          created_at: { type: 'string', format: 'date-time', example: '2026-11-06T00:00:00.000Z' },
        },
      },
      CreateSignalInput: {
        type: 'object',
        required: ['symbol', 'type', 'entry_price'],
        properties: {
          symbol: { type: 'string', example: 'BTC' },
          type: { type: 'string', enum: ['Long', 'Short'], example: 'Long' },
          entry_price: { type: 'number', example: 67500.5 },
          sl_price: { type: 'number', example: 66000.0 },
          tp_price: { type: 'number', example: 71000.0 },
          status: { type: 'string', enum: ['active', 'running', 'cancelled', 'profit', 'loss'], example: 'active' },
        },
      },
      UpdateSignalInput: {
        type: 'object',
        properties: {
          symbol_id: { type: 'string', example: 'BTC' },
          type: { type: 'string', enum: ['Long', 'Short'], example: 'Long' },
          entry_price: { type: 'number', example: 68000.0 },
          sl_price: { type: 'number', example: 66500.0 },
          tp_price: { type: 'number', example: 72000.0 },
          status: { type: 'string', example: 'running' },
        },
      },
      MarketSummary: {
        type: 'object',
        properties: {
          ticker: { type: 'string', example: 'BTC' },
          price_usd: { type: 'number', example: 67500.5 },
          price_idr: { type: 'number', example: 1086758050 },
          pct_change_1h: { type: 'number', example: 1.25 },
          point_change_1h: { type: 'number', example: 830.5 },
        },
      },
      MarketAnalytic: {
        type: 'object',
        properties: {
          ema_50: { type: 'number', example: 66800.25 },
          distance_to_ema50_pct: { type: 'string', example: '1.05%' },
          trend_status: { type: 'string', example: 'UPTREND' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Resource not found or bad request' },
        },
      },
    },
  },
};

