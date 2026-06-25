import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import os

print("\n" + "="*80)
print(" " * 20 + "🎬 MOVIE RECOMMENDATION SYSTEM")
print(" " * 15 + "Data Generation & Similarity Computation")
print("="*80)

np.random.seed(42)

# Movie Database
movies_data = {
    'MovieID': range(1, 51),
    'Title': [
        'The Shawshank Redemption', 'The Dark Knight', 'Inception', 'Pulp Fiction',
        'Forrest Gump', 'The Matrix', 'Interstellar', 'The Godfather', 'Fight Club', 'Parasite',
        'Avengers: Endgame', 'The Avengers', 'Black Panther', 'Iron Man', 'Captain America',
        'Thor: Ragnarok', 'Spider-Man: No Way Home', 'Doctor Strange', 'Ant-Man', 'Guardians Vol 1',
        'The Lion King', 'Frozen', 'Aladdin', 'Cinderella', 'Beauty and the Beast',
        'Toy Story', 'Finding Nemo', 'Cars', 'Inside Out', 'Coco',
        'A Quiet Place', 'Get Out', 'The Ring', 'Insidious', 'Hereditary',
        'Titanic', 'The Notebook', 'La La Land', 'Pride and Prejudice', 'The Fault in Our Stars',
        'Gladiator', 'Braveheart', 'The Great Escape', 'Dunkirk', 'Saving Private Ryan',
        'The Shining', 'Psycho', 'Halloween', 'Jaws', 'The Exorcist'
    ],
    'Genre': [
        'Drama', 'Action', 'Sci-Fi', 'Crime', 'Drama', 'Sci-Fi', 'Sci-Fi', 'Crime', 'Drama', 'Drama',
        'Action', 'Action', 'Action', 'Action', 'Action', 'Action', 'Action', 'Action', 'Action', 'Action',
        'Animation', 'Animation', 'Animation', 'Animation', 'Animation',
        'Animation', 'Animation', 'Animation', 'Animation', 'Animation',
        'Horror', 'Horror', 'Horror', 'Horror', 'Horror',
        'Romance', 'Romance', 'Romance', 'Romance', 'Romance',
        'War', 'War', 'War', 'War', 'War',
        'Horror', 'Horror', 'Horror', 'Horror', 'Horror'
    ]
}

movies_df = pd.DataFrame(movies_data)

print(f"\n✅ Created {len(movies_df)} movies")
print(f"   Genres: {', '.join(movies_df['Genre'].unique())}")

# Generate User Ratings
n_users = 100
rating_data = []

for user_id in range(1, n_users + 1):
    n_ratings = np.random.randint(12, 28)
    movie_ids = np.random.choice(len(movies_df), n_ratings, replace=False) + 1
    
    for movie_id in movie_ids:
        rating = np.random.uniform(1.5, 5.0)
        rating_data.append({
            'UserID': user_id,
            'MovieID': movie_id,
            'Rating': round(rating, 1)
        })

ratings_df = pd.DataFrame(rating_data)

print(f"✅ Generated {len(ratings_df)} ratings from {n_users} users")
print(f"   Sparsity: {(1 - len(ratings_df)/(n_users*len(movies_df)))*100:.1f}%")

# User-Movie Matrix
user_movie_matrix = ratings_df.pivot_table(
    index='UserID',
    columns='MovieID',
    values='Rating'
).fillna(0)

print(f"✅ User-Movie Matrix: {user_movie_matrix.shape}")

# Compute Similarities
print("\n📊 Computing Similarities...")

user_similarity = cosine_similarity(user_movie_matrix)
user_similarity_df = pd.DataFrame(
    user_similarity,
    index=user_movie_matrix.index,
    columns=user_movie_matrix.index
)

movie_similarity = cosine_similarity(user_movie_matrix.T)
movie_similarity_df = pd.DataFrame(
    movie_similarity,
    index=user_movie_matrix.columns,
    columns=user_movie_matrix.columns
)

print(f"✅ User Similarity Matrix: {user_similarity_df.shape}")
print(f"✅ Movie Similarity Matrix: {movie_similarity_df.shape}")

# Save Models
os.makedirs('model', exist_ok=True)

joblib.dump(movies_df, 'model/movies.pkl')
joblib.dump(ratings_df, 'model/ratings.pkl')
joblib.dump(user_movie_matrix, 'model/user_movie_matrix.pkl')
joblib.dump(user_similarity_df, 'model/user_similarity.pkl')
joblib.dump(movie_similarity_df, 'model/movie_similarity.pkl')

movies_df.to_csv('movies.csv', index=False)
ratings_df.to_csv('ratings.csv', index=False)

print("\n💾 Saved Models:")
print("   ✓ movies.pkl")
print("   ✓ ratings.pkl")
print("   ✓ user_movie_matrix.pkl")
print("   ✓ user_similarity.pkl")
print("   ✓ movie_similarity.pkl")

print("\n" + "="*80)
print(" " * 25 + "✨ Ready for Deployment!")
print("="*80 + "\n")
