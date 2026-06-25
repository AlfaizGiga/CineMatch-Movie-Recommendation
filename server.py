from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)

# Load Models
try:
    movies_df = joblib.load('model/movies.pkl')
    ratings_df = joblib.load('model/ratings.pkl')
    user_movie_matrix = joblib.load('model/user_movie_matrix.pkl')
    user_similarity_df = joblib.load('model/user_similarity.pkl')
    print("✅ Models loaded successfully!")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    print("   Run: python train_model.py")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/movies', methods=['GET'])
def get_movies():
    """Get all movies"""
    return jsonify(movies_df.to_dict('records'))

@app.route('/api/recommend', methods=['POST'])
def get_recommendations():
    """Get personalized recommendations"""
    try:
        data = request.json
        user_ratings = data.get('ratings', {})
        
        if not user_ratings or len(user_ratings) < 3:
            return jsonify({'error': 'Rate at least 3 movies'}), 400
        
        # Create user vector
        user_vector = np.zeros(len(user_movie_matrix.columns))
        for movie_id, rating in user_ratings.items():
            movie_id = int(movie_id)
            if 1 <= movie_id <= len(user_vector):
                user_vector[movie_id - 1] = float(rating)
        
        # Calculate similarity with all users
        user_vector_norm = user_vector / (np.linalg.norm(user_vector) + 1e-10)
        similarities = []
        
        for i, user_id in enumerate(user_movie_matrix.index):
            db_vector = user_movie_matrix.iloc[i].values
            db_vector_norm = db_vector / (np.linalg.norm(db_vector) + 1e-10)
            sim = np.dot(user_vector_norm, db_vector_norm)
            similarities.append((user_id, sim))
        
        similarities.sort(key=lambda x: x[1], reverse=True)
        similar_users = [uid for uid, sim in similarities[:10] if sim < 0.99][:5]
        
        if not similar_users:
            similar_users = [similarities[0][0]]
        
        # Get recommendations
        recommendations = {}
        rated_movies = set(int(mid) for mid in user_ratings.keys())
        
        for similar_user_id in similar_users:
            user_ratings_vec = user_movie_matrix.loc[similar_user_id]
            
            for movie_id in user_movie_matrix.columns:
                if movie_id not in rated_movies and user_ratings_vec[movie_id] > 0:
                    if movie_id not in recommendations:
                        recommendations[movie_id] = []
                    recommendations[movie_id].append(user_ratings_vec[movie_id])
        
        # Score recommendations
        recs = []
        for movie_id, ratings in recommendations.items():
            avg_rating = np.mean(ratings)
            movie = movies_df[movies_df['MovieID'] == movie_id].iloc[0]
            
            recs.append({
                'movieID': int(movie_id),
                'title': movie['Title'],
                'genre': movie['Genre'],
                'score': round(avg_rating, 2),
                'votes': len(ratings),
                'reason': f"Users like you rated this {round(avg_rating, 1)}/5"
            })
        
        recs.sort(key=lambda x: x['score'], reverse=True)
        
        return jsonify({
            'recommendations': recs[:10],
            'message': f"Based on {len(similar_users)} users with similar taste"
        })
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    print("\n🚀 Movie Recommendation Server")
    print("   URL: http://localhost:5003\n")
    app.run(debug=True, port=5003)
