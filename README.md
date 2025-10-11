# 🏨 Hotel Reservation System

A full-stack hotel booking platform with real-time room search, booking management, user reviews, authentication, and a built-in AI-powered chatbot assistant.

---

### Home Page  
Hero landing screen with a booking form for selecting stay dates and number of guests. Designed with a clean hotel-style layout and modern UX to make navigation intuitive for first-time users.



### 🖼️ Filter Section  
Booking filters where users choose check-in/check-out dates and specify the number of adults and children. The interface dynamically adjusts based on guest details and enables more accurate search results.



### 🖼️ Search Results  
Displays available room options based on selected filters. Each room card includes price, amenities, room description, and a **Check & Book** button for easy navigation.



### 🖼️ Filtered Results  
Users can refine results using a sidebar with budget range and essential amenities like Wi-Fi, AC, and room type. Real-time filtering improves search experience and usability.



### 🖼️ Room Details  
A detailed room description page with image gallery, price summary, full list of amenities, and booking button. Provides a closer look at room features before confirmation.



### 🖼️ Side Menu  
Responsive slide-out sidebar navigation with quick access to key pages such as Home, My Bookings, Reviews, Sign Up, and Sign In. Improves overall accessibility, especially on mobile.



### 🖼️ Sign In  
User authentication page allowing secure login with email and password. Includes a password reset option and link to registration for new users.



### 🖼️ My Bookings  
Booking management page where users can view their reservation history, stay dates, booking status, and cancel future bookings if needed.



### 🖼️ Reviews  
Users can leave hotel reviews and ratings. Displays total number of reviews, average rating, and offers the ability to delete personal reviews.

## 💬 Chat Assistant Screens – Breakdown

### 🖼️ Chat – Welcome Screen  
Initial chatbot interface greeting the user with a friendly message: _“Hello, Dear guest! How can I assist you?”_. Includes a message input field where users start the conversation.



### 🖼️ Chat – Message Processing  
After the user sends a message, the bot displays a **typing indicator** to simulate natural chat flow. Messages appear in real-time to create an interactive experience.


### 🖼️ Chat – Full Conversation  
Ongoing chatbot interaction where the system responds intelligently to user queries such as hotel policy, booking info, amenities, etc. Example: Asking about pets results in a detailed response about pet policy. Conversation ends politely when the user finishes.

---

## 🧠 Machine Learning Section

The chatbot model was trained to classify user queries and predict a corresponding intent category of each message. To build the model, I used a dataset consisting of input features in the form of sentences simulating real user queries and labels representing intent categories. To numerically represent the text, I applied **TF-IDF vectorization**, which assigns higher importance to relevant words while reducing the effect of common filler terms.

The model was trained using **supervised learning** with three classifiers:
- **Logistic Regression**
- **Multinomial Naive Bayes**
- **Linear Support Vector Machine (SVM)**  

A standard **80/20 train-test split** was used for evaluation, and model performance was measured using accuracy and classification reports. The highest-performing model was deployed inside the chatbot API.


## ⚙️ Tech Stack

### ✅ Frontend
- React
- Next.js
- TypeScript
- CSS Modules
- Axios
- Zustand

### ✅ Backend
- Next.js API Routes (Monolithic architecture)
- Prisma ORM
- PostgreSQL
- REST API

### ✅ Machine Learning
- Python
- Scikit-learn
- TF-IDF Vectorizer
- Logistic Regression / Naive Bayes / Linear SVM



