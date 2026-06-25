# 🎬 CineMatch - AI Movie Recommendation System

A production-ready movie recommendation engine using **Collaborative Filtering** and **Cosine Similarity**.

## 🚀 Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Generate data & train
python train_model.py

# Start server
python server.py

# Open browser
# http://localhost:5003
```

## 📋 Features

✅ **50+ Movies** across 8 genres  
✅ **Collaborative Filtering** - Find users like you  
✅ **Cosine Similarity** - Rate pattern matching  
✅ **Real-time Recommendations** - Instant results  
✅ **5-Star Rating System** - Interactive interface  
✅ **Genre Filtering** - Browse by category  
✅ **Modern Dark UI** - Beautiful design  

## 🧠 How It Works

1. **Rate 3+ movies** you've watched
2. **System finds users** with similar taste
3. **Gets movies they loved** but you haven't seen
4. **Ranks recommendations** by predicted rating
5. **Shows why** - "Users like you rated this X/5"

## 📊 Dataset

- **50 Movies** (Drama, Action, Sci-Fi, Animation, Horror, Romance, War, Crime)
- **100 Users** with realistic rating patterns
- **1500+ Ratings** creating a collaborative filtering matrix

## 🏗️ Architecture

```
CineMatch/
├── train_model.py          # Data generation & model training
├── server.py               # Flask backend
├── requirements.txt        # Dependencies
├── templates/
│   └── index.html          # Frontend
├── static/
│   ├── style.css           # Styling
│   └── script.js           # JavaScript
├── movies.csv              # Movie database
├── ratings.csv             # User ratings
└── model/                  # Trained models
    ├── movies.pkl
    ├── ratings.pkl
    ├── user_movie_matrix.pkl
    ├── user_similarity.pkl
    └── movie_similarity.pkl
```

## 🎓 What You Learn

- **Collaborative Filtering** - Industry-standard recommendation approach
- **Cosine Similarity** - Measuring user taste similarity (0-1 range)
- **Sparse Matrices** - Efficient data handling
- **Full-Stack ML** - Training to deployment
- **User Experience** - Interactive modern UI

## 💡 Use Cases

- **Netflix** - Movie recommendations
- **Spotify** - Music suggestions
- **Amazon** - Product recommendations
- **YouTube** - Video suggestions

## 🔧 Technical Details

**Similarity Calculation:**
```
similarity = (User1 · User2) / (|User1| × |User2|)
Range: 0 (different taste) to 1 (same taste)
```

**Recommendation Flow:**
1. User rates movies → Create rating vector
2. Compare to all 100 users in database
3. Find 5 most similar users
4. Get movies they rated 4+ stars
5. Recommend top 10 by average rating

## 📈 Performance

- **Sparsity**: ~70% (users don't rate all movies)
- **Similar Users Found**: 5 per recommendation
- **Recommendations Generated**: Top 10 per user
- **Similarity Range**: 0.0 to 1.0

## 🚀 Deployment

**Local:**
```bash
python server.py
```

**Production:**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5003 server:app
```

**Docker:**
```dockerfile
FROM python:3.11
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["python", "server.py"]
```

## 📝 API Endpoints

**GET /api/movies**
- Returns: List of all 50 movies

**POST /api/recommend**
- Body: `{ "ratings": { movieID: rating, ... } }`
- Returns: Top 10 recommendations with scores

## 💪 Portfolio Value

Perfect for showcasing:
- ML knowledge (classification → regression → recommendations)
- Full-stack capabilities (backend + frontend)
- Production-quality code
- User experience design
- Problem-solving skills

## 🔮 Future Enhancements

1. **Matrix Factorization** - SVD for better accuracy
2. **Hybrid Filtering** - Combine content + collaborative
3. **Real Movie Data** - TMDB API integration
4. **User Profiles** - Demographics-based filtering
5. **Feedback Loop** - Learn from user reactions
6. **A/B Testing** - Compare algorithms
7. **Deployment** - AWS/Heroku hosting

## ✨ Project Completion

- ✅ Data Generation
- ✅ Model Training
- ✅ Backend API
- ✅ Frontend UI
- ✅ Recommendations Engine
- ✅ Documentation
- ✅ GitHub Ready

---

**Built with 💪 for learning and portfolio.**

Questions? Check the code comments or reach out!
