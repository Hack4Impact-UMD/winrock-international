# 🚀 Winrock International Repository 🚀

## 📚 Table of Contents
- [Project Set Up](#%EF%B8%8F-project-set-up)
- [System Design](#-system-design)

---

### 🛠️ Project Set Up
This section is important, so make sure to go through these steps to ensure your set up is correct. Reach out to Tech Leads should there be any issues that arise.
#### 🌐 Folder/Directory Set Up
1. Ensure you have SSH key set up completed (documentation for this can be found [here](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)).
2. On the Github page, get the SSH clone link (referred to as SSH URL)
3. Cd into a folder on your system that will contain this project
4. ```git clone [SSH URL]```
Now, cd into the winrock-international project.

#### 🌐 Frontend
```
cd frontend
npm install  # install dependencies
npm run dev  # start the development server
```

#### 🌐 Backend
1. Install Firebase CLI
   ```
   npm install -g firebase-tools
   firebase login
   ```
2. Install dependencies
   ```
   cd functions
   npm install
   ```

---

### 🧩 System Design
A more detailed document on how the project is structured is linked here: Coming soon...

For your reference, the full, most recent design as of now is below - will be updated if there are any future changes.
```
winrock-international/
│── frontend/            # Frontend React (Vite + TypeScript)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── firebaseConfig.ts 
│── backend/             
│   ├── functions/       # Firebase Cloud Functions
│   │   ├── index.ts     
│   │   ├── package.json 
│   │   ├── tsconfig.json 
│   │   ├── .eslintrc.js  # Linting rules
│   ├── firestore.rules  # Firestore security rules
│   ├── .firebaserc      
│   ├── firebase.json    
│── .github/workflows/   # CI/CD pipeline (future)
│── README.md   
          
```


### Running the code

Running backend: ```uvicorn src.app:app --reload```

Running frontend: ```npm run dev```
