# Copacl - Smart Clipboard Manager

![Copacl Logo](client/public/icon-192.png)

**Copacl** (Copy-Paste-Clipboard) is a powerful, cross-platform clipboard manager designed for iOS and Android devices. Built as a Progressive Web App (PWA), it provides a seamless experience across all mobile platforms with advanced features that set it apart from competitors.

## 🌟 Features

### Core Features
- ✅ **Automatic History Tracking** - Save everything you copy automatically
- 🔍 **Instant Search** - Find any item in your clipboard history instantly
- 📌 **Pin Important Items** - Keep frequently used items at the top
- ❤️ **Favorites** - Mark items as favorites for quick access
- 🗑️ **Smart Management** - Delete individual items or clear all at once
- 📋 **Multiple Content Types** - Support for text, images, and links
- 🎨 **Modern UI** - Beautiful, dark-themed interface with smooth animations

### Advanced Competitive Features
- 🔐 **End-to-End Encryption** - Your data is encrypted and secure (coming soon)
- 🧠 **Smart Content Recognition** - Automatically detects URLs, emails, and phone numbers
- ⚡ **Quick Actions** - One-tap actions for recognized content (open link, send email, call)
- 🏷️ **Tags & Categories** - Organize your clipboard with custom tags
- 📱 **PWA Support** - Install as a native app on iOS and Android
- ⌨️ **Keyboard Shortcuts** - Power user features for faster workflow
- 🌐 **Cross-Device Sync** - Access your clipboard from any device (coming soon)
- 🎯 **Offline Support** - Works without internet connection

## 🚀 Quick Start

### For Users

1. **Visit the App**: Open [your-deployment-url] in your mobile browser
2. **Install**: Tap "Add to Home Screen" on iOS or "Install" on Android
3. **Sign In**: Create an account or sign in with your existing credentials
4. **Start Using**: Begin adding items to your clipboard history!

### For Developers

#### Prerequisites
- Node.js 22.x or higher
- pnpm package manager
- MySQL/TiDB database

#### Installation

```bash
# Clone the repository
git clone <repository-url>
cd copacl

# Install dependencies
pnpm install

# Set up environment variables
# Copy .env.example to .env and fill in your credentials

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

## 🏗️ Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Wouter** - Lightweight routing
- **shadcn/ui** - Beautiful component library
- **Lucide Icons** - Modern icon set

### Backend
- **Express 4** - Web server framework
- **tRPC 11** - End-to-end typesafe APIs
- **Drizzle ORM** - Type-safe database queries
- **MySQL/TiDB** - Relational database
- **Superjson** - Advanced serialization

### Infrastructure
- **PWA** - Progressive Web App capabilities
- **Service Worker** - Offline support
- **Manus Platform** - Deployment and hosting

## 📱 PWA Features

Copacl is a full-featured Progressive Web App that provides:

- **Installable** - Add to home screen on iOS and Android
- **Offline Support** - Works without internet connection
- **Fast Loading** - Cached resources for instant startup
- **Native Feel** - Looks and feels like a native app
- **Push Notifications** - Stay updated (coming soon)
- **Background Sync** - Sync data when connection is restored (coming soon)

## 🎯 Use Cases

- **Developers** - Save code snippets, commands, and API keys
- **Writers** - Keep track of quotes, references, and research
- **Students** - Organize study materials and notes
- **Professionals** - Manage contacts, emails, and important information
- **Everyone** - Never lose anything you copy again!

## 🔒 Privacy & Security

- **Local Storage** - All data is stored on your device by default
- **Encrypted Sync** - Cloud sync uses end-to-end encryption (coming soon)
- **No Tracking** - We don't track your clipboard content
- **Open Source** - Full transparency in how your data is handled

## 🎨 Screenshots

[Add screenshots here]

## 📖 User Guide

### Adding Items
1. Click the "+" button or use the input field
2. Choose the content type (Text, Image, or Link)
3. Enter your content and press Enter or click the add button

### Searching
- Use the search bar to find items instantly
- Search works across all content types
- Results update in real-time as you type

### Managing Items
- **Pin**: Click the pin icon to keep items at the top
- **Favorite**: Click the heart icon to mark as favorite
- **Copy**: Click the copy icon to copy to clipboard
- **Delete**: Click the trash icon to remove an item

### Keyboard Shortcuts
- `Ctrl/Cmd + K` - Focus search
- `Ctrl/Cmd + N` - Add new item
- `Ctrl/Cmd + Shift + Delete` - Clear all items
- `Shift + ?` - Show shortcuts help

## 🛠️ Development

### Project Structure

```
copacl/
├── client/                 # Frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities
│   │   └── App.tsx        # Main app component
├── server/                # Backend application
│   ├── _core/            # Core server logic
│   ├── db.ts             # Database queries
│   └── routers.ts        # tRPC routes
├── drizzle/              # Database schema
└── shared/               # Shared types
```

### Database Schema

The app uses three main tables:
- **users** - User accounts and authentication
- **clipboardItems** - Clipboard history items
- **tags** - Custom tags for organization
- **clipboardItemTags** - Many-to-many relationship

### API Routes

All API routes are defined in `server/routers.ts` using tRPC:
- `clipboard.list` - Get clipboard items
- `clipboard.search` - Search items
- `clipboard.create` - Add new item
- `clipboard.togglePin` - Pin/unpin item
- `clipboard.toggleFavorite` - Favorite/unfavorite item
- `clipboard.delete` - Delete item
- `clipboard.clearAll` - Clear all items
- `tags.list` - Get user tags
- `tags.create` - Create new tag

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Inspired by [Maccy](https://github.com/p0deje/Maccy) for macOS
- Built with the amazing [Manus](https://manus.im) platform
- UI components from [shadcn/ui](https://ui.shadcn.com)

## 📞 Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

**Made with ❤️ by the Copacl Team**

*Never lose what you copy again!*
