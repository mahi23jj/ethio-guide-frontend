// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// interface Message {
//   id: string;
//   type: 'user' | 'assistant';
//   content: string;
//   timestamp: string;
//   steps?: Step[];
// }

// interface Step {
//   id: number;
//   title: string;
//   icon: string;
//   items: string[];
//   completed?: boolean;
// }

// interface ChatHistory {
//   id: string;
//   title: string;
//   lastMessage: string;
//   timestamp: string;
//   messageCount: number;
// }

// interface AiChatState {
//   messages: Message[];
//   chatHistory: ChatHistory[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: AiChatState = {
//   messages: [],
//   chatHistory: [],
//   status: 'idle',
//   error: null,
// };

// export const fetchChatHistory = createAsyncThunk(
//   'aiChat/fetchChatHistory',
//   async (token: string, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/ai/history`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.data.data.map((item: any) => ({
//         id: item.id,
//         title: item.request,
//         lastMessage: item.response.substring(0, 50) + '...',
//         timestamp: new Date(item.timestamp).toLocaleString(),
//         messageCount: 1, // Adjust based on actual data if available
//       }));
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch chat history');
//     }
//   }
// );

// interface SendMessageArgs {
//   query: string;
//   token: string;
// }

// export const sendMessage = createAsyncThunk(
//   'aiChat/sendMessage',
//   async ({ query, token }: SendMessageArgs, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/ai/guide`,
//         { query },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return {
//         id: response.data.id,
//         type: 'assistant' as const,
//         content: response.data.response,
//         timestamp: new Date(response.data.timestamp).toLocaleString(),
//         steps: response.data.procedures?.map((proc: any, index: number) => ({
//           id: index + 1,
//           title: proc.name,
//           icon: 'FileText', // Default icon, can be mapped dynamically if needed
//           items: [], // API doesn't provide detailed steps, so keep empty
//         })),
//       };
//     } catch (error: any) {
//         console.error('Error sending message:', error);
//       return rejectWithValue(error.response?.data?.message || 'Failed to send message');
//     }
//   }
// );

// const aiChatSlice = createSlice({
//   name: 'aiChat',
//   initialState,
//   reducers: {
//     addUserMessage: (state, action: PayloadAction<Message>) => {
//       state.messages.push(action.payload);
//     },
//     clearMessages: (state) => {
//       state.messages = [];
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchChatHistory.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchChatHistory.fulfilled, (state, action: PayloadAction<ChatHistory[]>) => {
//         state.status = 'succeeded';
//         state.chatHistory = action.payload;
//       })
//       .addCase(fetchChatHistory.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string;
//       })
//       .addCase(sendMessage.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
//         state.status = 'succeeded';
//         state.messages.push(action.payload);
//       })
//       .addCase(sendMessage.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { addUserMessage, clearMessages, clearError } = aiChatSlice.actions;
// export default aiChatSlice.reducer;


// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ethio-guide-backend-1.onrender.com/api/v1';

// interface Message {
//   id: string;
//   type: 'user' | 'assistant';
//   content: string;
//   timestamp: string;
//   steps?: Step[];
// }

// interface Step {
//   id: number;
//   title: string;
//   icon: string;
//   items: string[];
//   completed?: boolean;
// }

// interface ChatHistory {
//   id: string;
//   title: string;
//   lastMessage: string;
//   timestamp: string;
//   messageCount: number;
// }

// interface AiChatState {
//   messages: Message[];
//   chatHistory: ChatHistory[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: AiChatState = {
//   messages: [],
//   chatHistory: [],
//   status: 'idle',
//   error: null,
// };

// export const fetchChatHistory = createAsyncThunk(
//   'aiChat/fetchChatHistory',
//   async (token: string, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/ai/history`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.data.data.map((item: any) => ({
//         id: item.id,
//         title: item.request,
//         lastMessage: item.response.substring(0, 50) + '...',
//         timestamp: new Date(item.timestamp).toLocaleString(),
//         messageCount: 1,
//       }));
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch chat history');
//     }
//   }
// );

// export const fetchChatById = createAsyncThunk(
//   'aiChat/fetchChatById',
//   async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/ai/history`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const chat = response.data.data.find((item: any) => item.id === id);
//       if (!chat) {
//         return rejectWithValue('Chat not found');
//       }
//       return [
//         {
//           id: `${chat.id}-user`,
//           type: 'user' as const,
//           content: chat.request,
//           timestamp: new Date(chat.timestamp).toLocaleString(),
//         },
//         {
//           id: chat.id,
//           type: 'assistant' as const,
//           content: chat.response,
//           timestamp: new Date(chat.timestamp).toLocaleString(),
//           steps: chat.procedures?.map((proc: any, index: number) => ({
//             id: index + 1,
//             title: proc.name,
//             icon: 'FileText',
//             items: [],
//           })),
//         },
//       ];
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch chat');
//     }
//   }
// );

// interface SendMessageArgs {
//   query: string;
//   token: string;
// }

// export const sendMessage = createAsyncThunk(
//   'aiChat/sendMessage',
//   async ({ query, token }: SendMessageArgs, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/ai/guide`,
//         { query },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return {
//         id: response.data.id,
//         type: 'assistant' as const,
//         content: response.data.response,
//         timestamp: new Date(response.data.timestamp).toLocaleString(),
//         steps: response.data.procedures?.map((proc: any, index: number) => ({
//           id: index + 1,
//           title: proc.name,
//           icon: 'FileText',
//           items: [],
//         })),
//       };
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to send message');
//     }
//   }
// );

// const aiChatSlice = createSlice({
//   name: 'aiChat',
//   initialState,
//   reducers: {
//     addUserMessage: (state, action: PayloadAction<Message>) => {
//       state.messages.push(action.payload);
//     },
//     clearMessages: (state) => {
//       state.messages = [];
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchChatHistory.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchChatHistory.fulfilled, (state, action: PayloadAction<ChatHistory[]>) => {
//         state.status = 'succeeded';
//         state.chatHistory = action.payload;
//       })
//       .addCase(fetchChatHistory.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string;
//       })
//       .addCase(fetchChatById.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchChatById.fulfilled, (state, action: PayloadAction<Message[]>) => {
//         state.status = 'succeeded';
//         state.messages = action.payload;
//       })
//       .addCase(fetchChatById.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string;
//       })
//       .addCase(sendMessage.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
//         state.status = 'succeeded';
//         state.messages.push(action.payload);
//       })
//       .addCase(sendMessage.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { addUserMessage, clearMessages, clearError } = aiChatSlice.actions;
// export default aiChatSlice.reducer;










import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ethio-guide-backend-1.onrender.com/api/v1';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  procedures?: Procedure[];
}

interface Procedure {
  id: number;
  title: string;
  icon: string;
  items: string[];
  completed?: boolean;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messageCount: number;
}

interface AiChatState {
  messages: Message[];
  chatHistory: ChatHistory[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AiChatState = {
  messages: [],
  chatHistory: [],
  status: 'idle',
  error: null,
};

export const fetchChatHistory = createAsyncThunk(
  'aiChat/fetchChatHistory',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ai/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data.map((item: {
        id: string;
        request: string;
        response: string;
        timestamp: string;
      }) => ({
        id: item.id,
        title: item.request,
        lastMessage: item.response.substring(0, 50) + '...',
        timestamp: new Date(item.timestamp).toLocaleString(),
        messageCount: 1,
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to fetch chat history');
      }
      return rejectWithValue('Failed to fetch chat history');
    }
  }
);

export const fetchChatById = createAsyncThunk(
  'aiChat/fetchChatById',
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ai/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const chat = response.data.data.find((item: { id: string }) => item.id === id);
      if (!chat) {
        return rejectWithValue('Chat not found');
      }
      return [
        {
          id: `${chat.id}-user`,
          type: 'user' as const,
          content: chat.request,
          timestamp: new Date(chat.timestamp).toLocaleString(),
        },
        {
          id: chat.id,
          type: 'assistant' as const,
          content: chat.response,
          timestamp: new Date(chat.timestamp).toLocaleString(),
          procedures: chat.procedures?.map((proc: { name: string }, index: number) => ({
            id: index + 1,
            title: proc.name,
            icon: 'FileText',
            items: [],
          })),
        },
      ];
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to fetch chat');
      }
      return rejectWithValue('Failed to fetch chat');
    }
  }
);

interface SendMessageArgs {
  query: string;
  token: string;
}

export const sendMessage = createAsyncThunk(
  'aiChat/sendMessage',
  async ({ query, token }: SendMessageArgs, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai/guide`,
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return {
        id: response.data.id,
        type: 'assistant' as const,
        content: response.data.response,
        timestamp: new Date(response.data.timestamp).toLocaleString(),
        procedures: response.data.procedures?.map((proc: { name: string }, index: number) => ({
          id: index + 1,
          title: proc.name,
          icon: 'FileText',
          items: [],
        })),
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to send message');
      }
      return rejectWithValue('Failed to send message');
    }
  }
);

const aiChatSlice = createSlice({
  name: 'aiChat',
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChatHistory.fulfilled, (state, action: PayloadAction<ChatHistory[]>) => {
        state.status = 'succeeded';
        state.chatHistory = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchChatById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChatById.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchChatById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.status = 'succeeded';
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { addUserMessage, clearMessages, clearError } = aiChatSlice.actions;
export default aiChatSlice.reducer;