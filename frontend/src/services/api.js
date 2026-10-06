const API_URL = 'http://localhost:5000/api';

// Create authorization header helper
export const getAuthHeader = () => {
  const token = localStorage.getItem('healthsync_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Authentication endpoints
  auth: {
    register: async (email, password) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data;
    },
    login: async (email, password) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data;
    },
    forgotPassword: async (email) => {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');
      return data;
    },
    resetPassword: async (email, token, newPassword) => {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');
      return data;
    }
  },

  // Profile endpoints
  profile: {
    get: async () => {
      const res = await fetch(`${API_URL}/profile`, {
        headers: { ...getAuthHeader() }
      });
      if (res.status === 404) return null;
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
      return data;
    },
    save: async (profileData) => {
      const res = await fetch(`${API_URL}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save profile');
      return data;
    }
  },

  // Wellness tracker endpoints
  wellness: {
    getSummary: async () => {
      const res = await fetch(`${API_URL}/wellness/summary`, {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch wellness summary');
      return data;
    },
    logWeight: async (weight, date) => {
      const res = await fetch(`${API_URL}/wellness/weight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ weight, date })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to log weight');
      return data;
    },
    logWater: async (amount_ml, date, mode = 'add') => {
      const res = await fetch(`${API_URL}/wellness/water`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ amount_ml, date, mode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to log water');
      return data;
    },
    logSleep: async (duration_hours, quality, date) => {
      const res = await fetch(`${API_URL}/wellness/sleep`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ duration_hours, quality, date })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to log sleep');
      return data;
    }
  },

  // Medication search and reminders
  medication: {
    search: async (query) => {
      const res = await fetch(`${API_URL}/medication/search?query=${encodeURIComponent(query)}`, {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to search medication');
      return data;
    },
    getAlternatives: async (ingredient) => {
      const res = await fetch(`${API_URL}/medication/alternatives?ingredient=${encodeURIComponent(ingredient)}`, {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch alternatives');
      return data;
    },
    getSaved: async () => {
      const res = await fetch(`${API_URL}/medication/saved`, {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch saved medicines');
      return data;
    },
    save: async (medData) => {
      const res = await fetch(`${API_URL}/medication/saved`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(medData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save medicine');
      return data;
    },
    deleteSaved: async (id) => {
      const res = await fetch(`${API_URL}/medication/saved/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete saved medicine');
      return data;
    },
    getHistory: async () => {
      const res = await fetch(`${API_URL}/medication/history`, {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch search history');
      return data;
    },
    getReminders: async () => {
      const res = await fetch(`${API_URL}/medication/reminders`, {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch reminders');
      return data;
    },
    createReminder: async (reminderData) => {
      const res = await fetch(`${API_URL}/medication/reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(reminderData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create reminder');
      return data;
    },
    deleteReminder: async (id) => {
      const res = await fetch(`${API_URL}/medication/reminders/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete reminder');
      return data;
    }
  },

  // Nutrition logging and search
  food: {
    search: async (query) => {
      const res = await fetch(`${API_URL}/food/search?query=${encodeURIComponent(query)}`, {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to search food');
      return data;
    },
    getLogs: async (date) => {
      const res = await fetch(`${API_URL}/food/logs?date=${date}`, {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch meal logs');
      return data;
    },
    logMeal: async (mealData) => {
      const res = await fetch(`${API_URL}/food/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(mealData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to log meal');
      return data;
    },
    deleteLog: async (id) => {
      const res = await fetch(`${API_URL}/food/logs/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete meal log');
      return data;
    }
  },

  // Exercise listings and logging
  exercise: {
    search: async (query = '', category = '') => {
      const res = await fetch(`${API_URL}/exercise/search?query=${encodeURIComponent(query)}&category=${category}`, {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to search exercises');
      return data;
    },
    getLogs: async (date) => {
      const res = await fetch(`${API_URL}/exercise/logs?date=${date}`, {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch exercise logs');
      return data;
    },
    logWorkout: async (workoutData) => {
      const res = await fetch(`${API_URL}/exercise/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(workoutData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to log workout');
      return data;
    },
    deleteLog: async (id) => {
      const res = await fetch(`${API_URL}/exercise/logs/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete workout log');
      return data;
    }
  },

  // AI Planner and Chat Endpoints
  ai: {
    explainMedicine: async (medData) => {
      const res = await fetch(`${API_URL}/ai/explain-medicine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(medData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to explain medicine');
      return data.explanation;
    },
    compareMedicines: async (medA, medB) => {
      const res = await fetch(`${API_URL}/ai/compare-medicines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ medA, medB })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to compare medicines');
      return data.comparison;
    },
    generateDietPlan: async () => {
      const res = await fetch(`${API_URL}/ai/diet`, {
        method: 'POST',
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to generate diet plan');
      return data;
    },
    generateWorkoutPlan: async () => {
      const res = await fetch(`${API_URL}/ai/workout`, {
        method: 'POST',
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to generate workout plan');
      return data;
    },
    getWeeklySummary: async () => {
      const res = await fetch(`${API_URL}/ai/weekly-summary`, {
        headers: { ...getAuthHeader() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch weekly summary');
      return data.summary;
    },
    chat: async (question) => {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to process chat query');
      return data.reply;
    }
  }
};
