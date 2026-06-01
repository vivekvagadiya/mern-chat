# Project Scope: MERN Real-time Chat Application

## Overview
A lightweight, real-time chat application built with MongoDB, Express, React, and Node.js (MERN) utilizing Socket.io for real-time bidirectional communication. The focus is on learning real-time integrations, chat room architecture, and state synchronization between the client and server.

## Core Features
- 1-on-1 and Group Chat capabilities.
- Real-time messaging using Socket.io rooms.
- Real-time Online/Offline user status.
- Typing indicators with debouncing.
- Chat history persistence (MongoDB).
- JWT-based authentication for HTTP and Socket connections.

---

## Sprint Plan

### Sprint 1: Foundation & Database Architecture
**Goal:** Set up the environment and establish the database models and REST APIs.
* **Backend Tasks:**
  * Initialize Node.js/Express server.
  * Define Mongoose Schemas (`User`, `Chat`, `Message`).
  * Create REST API route: `POST /api/chats` (Create 1-1 or Group Chat).
  * Create REST API route: `GET /api/chats` (Fetch all chats for logged-in user).
  * Create REST API route: `GET /api/messages/:chatId` (Fetch message history for a chat).
  * Create REST API route: `POST /api/messages` (Send/Save a message via HTTP - optional fallback).
* **Frontend Tasks:**
  * Initialize React application.
  * Create basic UI layouts: Sidebar (Chat List) and Chat Window.
  * Implement API calls to fetch user's chats and load them into the UI state.

### Sprint 2: Socket.io Foundation & Presence (Online/Offline)
**Goal:** Establish the WebSocket connection and track who is currently active in the app.
* **Backend Tasks:**
  * Install and initialize `socket.io` on the Express server.
  * Implement Socket Middleware to authenticate connections using JWT.
  * Create an in-memory data structure (e.g., `Map`) to link `userId` to `socketId`.
  * Emit `user_online` and `user_offline` events globally or to relevant friends.
* **Frontend Tasks:**
  * Install `socket.io-client`.
  * Create a centralized Socket context or custom hook to manage the connection.
  * Listen for `user_online` / `user_offline` events and update the Sidebar UI to show green/gray status dots.

### Sprint 3: Real-Time Messaging & Chat Rooms
**Goal:** Enable users to send and receive messages instantly within specific 1-on-1 or group chats.
* **Backend Tasks:**
  * Create `join_chat` socket listener to add users to specific Socket.io rooms (`socket.join(chatId)`).
  * Create `new_message` socket listener. When received, broadcast it to the specific chat room (`socket.to(chatId).emit(...)`).
* **Frontend Tasks:**
  * Emit `join_chat` event whenever the user clicks on an active chat in the sidebar.
  * Emit `new_message` event when the user clicks "Send".
  * Listen for `message_received` and append the incoming message to the current chat window state.

### Sprint 4: UX Enhancements (Typing Indicators & Optimization)
**Goal:** Polish the user experience and implement industry-standard chat optimizations.
* **Backend Tasks:**
  * Add `typing` and `stop_typing` listeners and broadcast them to the specific chat rooms.
  * Implement basic pagination logic on the `GET /api/messages/:chatId` route.
* **Frontend Tasks:**
  * Implement a debounce function on the message input field to emit `typing` and `stop_typing` efficiently.
  * Add visual typing indicators (e.g., "User is typing...") in the chat window.
  * Implement an infinite scroll or "Load More" button to fetch previous messages using pagination.
  * (Optional) Update sidebar unread message counts when a message is received for a chat the user is not currently viewing.
