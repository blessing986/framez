<div align="center">

# 📸 Framez

### A Modern Social Media Mobile Application

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)

**Share your moments with the world through beautiful posts with images and text**

</div>

---

## 🎯 Overview

Framez is a cross-platform mobile social media application built with React Native that demonstrates modern app development practices. The app features real-time data synchronization, secure authentication, cloud storage, and a beautiful, responsive UI inspired by Instagram.

### Key Highlights

- 🔐 **Secure Authentication** - Email/password with persistent sessions
- 📝 **Rich Posts** - Combine text and images in your posts
- ⚡ **Real-time Updates** - See new posts instantly upon refresh
- 👤 **User Profiles** - Personalized profile with post history

---

## ✨ Features

### 🔐 Authentication System
- User registration with email, password, and username
- Secure login with session persistence
- Auto-login on app restart
- Logout with confirmation dialog
- Automatic profile creation on signup

### 📝 Post Management
- Create posts with text content (up to 500 characters)
- Upload images from gallery or capture with camera
- Image preview before posting with remove option
- Real-time character counter
- Posts display with author info and timestamp

### 📱 Feed Experience
- Chronological feed of all user posts
- Pull-to-refresh functionality
- Real-time updates when new posts are created
- Beautiful post cards with user avatars
- Human-readable timestamps (2m ago, 3h ago, etc.)
- Empty state design

### 👤 User Profile
- Profile header with gradient background
- Display username, email, and join date
- Post statistics (total posts count)
- Instagram-style 3-column post grid
- Avatar with first letter placeholder
- Verification badge indicator
- View all posts by user
---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React Native | 0.74.5 | Cross-platform mobile framework |
| Expo | ~51.0.0 | Development platform & tooling |
| TypeScript | Latest | Type-safe development |
| React Navigation | 6.x | Navigation management |

### Backend & Services
| Service | Purpose |
|---------|---------|
| Supabase | Backend-as-a-Service |
| PostgreSQL | Relational database |
| Supabase Auth | User authentication |
| Supabase Storage | Image storage |
| Supabase Realtime | Live data updates |

---

## 🎯 Why Supabase?

I chose **Supabase** as the backend solution for the following reasons:

### ✅ Advantages
1. **All-in-One Platform** - Auth, Database, Storage, and Realtime in one place
2. **PostgreSQL** - Powerful relational database with full SQL support
3. **Built-in Authentication** - Secure auth system out of the box
4. **Real-time Subscriptions** - Live updates without polling
5. **Row Level Security** - Database-level security policies
6. **Generous Free Tier** - Perfect for demos and MVPs
7. **Easy File Storage** - Simple image upload with public URLs
8. **Excellent DX** - Great documentation and TypeScript support
9. **Open Source** - Can self-host if needed

### 🔄 Alternatives Considered
- **Firebase** - Excellent but uses NoSQL (less structured data)
- **Convex** - Newer with smaller ecosystem and less mature
- **Clerk** - Auth-only solution, requires separate database

Supabase provided the best balance of features, ease of use, and developer experience for this project.

---

## 🚀 Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [Expo Go](https://expo.dev/client) app on your mobile device

### Step 1: Clone the Repository

```bash
git clone https://github.com/blessing986/framez.git
cd framez
```

### Step 2: Install Dependencies

```bash
npm install
```

Or with yarn:

```bash
yarn install
```
---

## 🎮 Usage

### Start Development Server

```bash
npx expo start
```

Or clear cache:

```bash
npx expo start -c
```

### Run on Device

#### Physical Device (Recommended)

1. Install **Expo Go** on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app
---
## 🎥 Demo

### Links

- **Live Demo**: [Appetize.io Link](https://appetize.io/embed/b_izckzowmc7xfmzzwl3w2bsqt34)
- **Demo Video**: [Google Drive](https://drive.google.com/file/d/1lfYVvrVXIy0NFgOCSQr6EuQVdyHTEFBb/view?usp=sharing)
- **APK Download**: [Direct Download](https://drive.google.com/file/d/1N7g_8_FApMW0kbzJjT6pxb9w54IWQgBd/view?usp=sharing)
---

## 👨‍💻 Contact

- GitHub: [@blessing986](https://github.com/blessing986)
- Email: dev.blessingubiomor@gmail.com

---

**Built with ❤️ using React Native & Supabase**
