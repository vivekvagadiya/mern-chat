# 🚀 Quick Start Guide

## Get Started in 5 Minutes

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Start Development Server
```bash
npm run dev
```

The app opens automatically at `http://localhost:3000`

### 3️⃣ Explore the Features

#### 🔍 Search (⌘K / Ctrl+K)
- Press `⌘K` or `Ctrl+K` to open global search
- Search users, conversations, or messages
- Click result to navigate

#### 💬 Send Messages
- Type in message input (auto-expands)
- Press `Enter` to send
- Shift+Enter for new line

#### 😊 Reactions
- Hover over message
- Click emoji button
- Select reaction from picker

#### 📌 Manage Conversations
- Pin/favorite conversations in sidebar
- Filter by Pinned or Favorites
- Unread badges show count

#### 🔔 Notifications
- Click bell icon to view notifications
- Mark as read
- Dismiss individually or all

#### ⚙️ Settings
- Click settings gear icon
- Change theme (dark/light)
- Configure notifications
- Update privacy settings

#### 👤 Profile
- Click on user profile area
- View profile information
- Contact details
- Activity stats

### 4️⃣ Project Structure Quick Tour

**Key Files:**
```
src/
├── App.jsx                      # Root component
├── layouts/MainLayout.jsx       # Main layout
├── components/
│   ├── chat/                    # Chat components
│   ├── layouts/                 # Layout components
│   ├── modals/                  # Modals
│   └── panels/                  # Side panels
├── store/index.js               # Redux state
└── mock/data.js                 # Mock data
```

### 5️⃣ Making Changes

#### 📝 Add Mock Data
Edit `src/mock/data.js`:
```javascript
export const mockUsers = [
  { id: '1', name: 'New User', ... }
]
```

#### 🎨 Change Styling
Edit `tailwind.config.js` for theme:
```javascript
colors: {
  'primary': '#new-color'
}
```

#### 🔄 Add Redux State
Edit `src/store/index.js`:
```javascript
const newSlice = createSlice({
  name: 'newFeature',
  initialState: { ... }
})
```

## Key Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Open search |
| `Esc` | Close modals |
| `Enter` | Send message |
| `Shift+Enter` | New line |
| `Alt+N` | New conversation (future) |

## File Descriptions

### Components

**Sidebar (sidebar.jsx)**
- Left navigation panel
- Conversation list
- Filters & search
- Settings/notifications buttons

**ChatArea (ChatArea.jsx)**
- Main message display
- Message composer
- Conversation header
- Action buttons

**MessageBubble (MessageBubble.jsx)**
- Individual message
- Reactions support
- Hover actions
- Status indicators

**MessageComposer (MessageComposer.jsx)**
- Text input area
- Emoji picker
- Attachment menu
- Send button

**SearchModal (SearchModal.jsx)**
- Global search interface
- Command palette style
- Multi-category results

**NotificationsPanel (NotificationsPanel.jsx)**
- Notification list
- Read/unread states
- Quick dismissal

**UserProfilePanel (UserProfilePanel.jsx)**
- User profile view
- Contact info
- Action buttons

**SettingsPanel (SettingsPanel.jsx)**
- Appearance settings
- Notifications config
- Privacy settings

### Redux Store

All state management in `src/store/index.js`:
- **auth** - User login state
- **chat** - Conversations & messages
- **ui** - Modal/panel states
- **users** - User list & status
- **notifications** - Notification list

### Mock Data

Realistic data in `src/mock/data.js`:
- 5 mock users
- 6 conversations
- Message threads
- Notifications
- Groups

## Common Tasks

### 🔌 Connect to Real API

1. Create API service:
```javascript
// src/services/api.js
export async function fetchConversations() {
  const res = await fetch('/api/conversations')
  return res.json()
}
```

2. Update component:
```javascript
useEffect(() => {
  fetchConversations().then(conversations => {
    dispatch(setConversations(conversations))
  })
}, [])
```

### 🔌 Add WebSocket

1. Install Socket.IO:
```bash
npm install socket.io-client
```

2. Create socket connection:
```javascript
// src/services/socket.js
import io from 'socket.io-client'
export const socket = io(process.env.VITE_API_URL)
```

3. Listen to events:
```javascript
socket.on('message:new', (message) => {
  dispatch(addMessage({ conversationId, message }))
})
```

### 👤 Implement Authentication

Replace mock auth in `src/store/index.js`:
```javascript
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    token: localStorage.getItem('token')
  },
  // Add login/logout reducers
})
```

## Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js
server: {
  port: 3001
}
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Styles Not Loading
```bash
# Rebuild Tailwind
npm run build
```

### Redux Not Updating
```bash
# Check Redux DevTools browser extension
# Verify actions are dispatched
console.log(store.getState())
```

## Next Steps

1. ✅ Explore the UI
2. ✅ Check mock data
3. ✅ Review Redux store
4. ✅ Plan API integration
5. ✅ Implement WebSocket
6. ✅ Add authentication
7. ✅ Deploy to production

## Resources

- [Project README](./README.md) - Full documentation
- [Architecture Guide](./ARCHITECTURE.md) - Deep dive
- [File Structure](./FILE_STRUCTURE.md) - Detailed file overview
- [React Docs](https://react.dev)
- [Redux Docs](https://redux.js.org)
- [Tailwind CSS](https://tailwindcss.com)

## Need Help?

1. Check README.md for detailed docs
2. Review ARCHITECTURE.md for system design
3. Look at mock/data.js for data structure
4. Check component JSDoc comments
5. Use Redux DevTools to debug state

---

**Happy coding! 🎉**

Built with ❤️ using React, Vite, Tailwind CSS, and Framer Motion
