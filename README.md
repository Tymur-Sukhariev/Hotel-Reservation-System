# 🏨 Hotel Reservation System

A full-stack hotel booking platform with real-time room search, booking management, user reviews, authentication, and a built-in AI-powered chatbot assistant.

---

### Home Page 
<img width="2048" height="1038" alt="home" src="https://github.com/user-attachments/assets/29522d2d-598c-43e4-ab95-ebf93ca6eeb9" />

Hero landing screen with a booking form for selecting stay dates and number of guests. Designed with a clean hotel-style layout and modern UX to make navigation intuitive for first-time users.

---

### Filter Section  
<img width="402" height="415" alt="calendar" src="https://github.com/user-attachments/assets/92c0b05f-2ebc-4715-8564-75f8789de962" /><br>
<img width="742" height="236" alt="guests" src="https://github.com/user-attachments/assets/130099ba-b14d-41b6-bcd5-32c6bdea6b8f" />

Booking filters where users choose check-in/check-out dates and specify the number of adults and children. The interface dynamically adjusts based on guest details and enables more accurate search results.

---

### Search Results  
<img width="2048" height="1032" alt="search_res" src="https://github.com/user-attachments/assets/05ba8767-5b18-4a04-9568-180d5beb2631" />

Displays available room options based on selected filters. Each room card includes price, amenities, room description, and a **Check & Book** button for easy navigation.

---

### Filtered Results  
<img width="1727" height="712" alt="filters" src="https://github.com/user-attachments/assets/e91fad20-84be-4bad-a552-2ef9d0078024" />

Users can refine results using a sidebar with budget range and essential amenities like Wi-Fi, AC, and room type. Real-time filtering improves search experience and usability.

---

### Room Details  
<img width="2048" height="1038" alt="detailed" src="https://github.com/user-attachments/assets/89527a2f-5fef-4fc3-bcf4-0abbc730ede7" />

A detailed room description page with image gallery, price summary, full list of amenities, and booking button. Provides a closer look at room features before confirmation.

---

### Side Menu  
<img width="1888" height="853" alt="sidemenu" src="https://github.com/user-attachments/assets/3ad8aa1a-2c00-4c97-83ac-6bec4607aee7" />

Responsive slide-out sidebar navigation with quick access to key pages such as Home, My Bookings, Reviews, Sign Up, and Sign In. Improves overall accessibility, especially on mobile.

---

### Sign In  
<img width="908" height="636" alt="signin" src="https://github.com/user-attachments/assets/47232156-d36c-44d5-953d-d9e6c27c1adc" />

User authentication page allowing secure login with email and password. Includes a password reset option and link to registration for new users.

---

### My Bookings  
<img width="2048" height="608" alt="bookings" src="https://github.com/user-attachments/assets/8b079932-b809-4646-8814-d2679696ff32" />

Booking management page where users can view their reservation history, stay dates, booking status, and cancel future bookings if needed.

---

### Reviews 
<img width="1057" height="698" alt="reviews" src="https://github.com/user-attachments/assets/6b3304bd-3580-48a0-9440-413103c44775" />

Users can leave hotel reviews and ratings. Displays total number of reviews, average rating, and offers the ability to delete personal reviews.

## 💬 Chat Assistant – Breakdown

### Chat – Welcome Screen  
<img width="2048" height="1038" alt="chat" src="https://github.com/user-attachments/assets/c5d9f7ef-0617-481e-a1d8-edae77c5a6e6" />

Initial chatbot interface greeting the user with a friendly message: _“Hello, Dear guest! How can I assist you?”_. Includes a message input field where users start the conversation.



### Chat – Message Processing  
<img width="2048" height="1152" alt="chat2" src="https://github.com/user-attachments/assets/e27c90dd-1238-4ca4-baa9-06ffd9a32e48" />

After the user sends a message, the bot displays a **typing indicator** to simulate natural chat flow. Messages appear in real-time to create an interactive experience.


### Chat – Full Conversation  
<img width="1069" height="734" alt="Screenshot 2025-10-11 at 15 12 30" src="https://github.com/user-attachments/assets/284e7ea4-67a5-44be-8e06-511c9703066b" />

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
- Tailwind
- CSS Modules
- TanStackQuery
- Redux toolkit

### ✅ Backend
- Next.js API Routes 
- Prisma ORM
- PostgreSQL
- REST API

### ✅ Machine Learning
- Python
- Scikit-learn
- TF-IDF Vectorizer
- Logistic Regression / Naive Bayes / Linear SVM



