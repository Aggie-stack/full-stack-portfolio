from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os

# ==============================
# App Setup
# ==============================
app = Flask(__name__)

# ==============================
# CORS Setup
# ==============================
# Replace with your actual Vercel frontend URL
frontend_url = os.environ.get("FRONTEND_URL", "*")  # '*' allows all origins if FRONTEND_URL not set
CORS(app, origins=[frontend_url], supports_credentials=True)

# ==============================
# Database Configuration
# ==============================
# Use SQLite locally; on Render consider PostgreSQL for persistence
db_url = os.environ.get("DATABASE_URL")
if db_url:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
else:
    db_path = os.path.join(os.path.dirname(__file__), "projects.db")
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# ==============================
# Models
# ==============================
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    github = db.Column(db.String(250), nullable=False)
    liveDemo = db.Column(db.String(250), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "github": self.github,
            "liveDemo": self.liveDemo
        }

# ==============================
# Routes
# ==============================
@app.route("/projects", methods=["GET"])
def get_projects():
    projects = Project.query.all()
    return jsonify([p.to_dict() for p in projects])

@app.route("/projects", methods=["POST"])
def add_project():
    data = request.get_json()
    if not data or not data.get("title") or not data.get("description") or not data.get("github"):
        return jsonify({"error": "Missing required fields"}), 400
    project = Project(
        title=data["title"],
        description=data["description"],
        github=data["github"],
        liveDemo=data.get("liveDemo")
    )
    db.session.add(project)
    db.session.commit()
    return jsonify(project.to_dict()), 201

@app.route("/projects/<int:id>", methods=["PUT"])
def update_project(id):
    project = Project.query.get_or_404(id)
    data = request.get_json()
    project.title = data.get("title", project.title)
    project.description = data.get("description", project.description)
    project.github = data.get("github", project.github)
    project.liveDemo = data.get("liveDemo", project.liveDemo)
    db.session.commit()
    return jsonify(project.to_dict()), 200

@app.route("/projects/<int:id>", methods=["DELETE"])
def delete_project(id):
    project = Project.query.get_or_404(id)
    db.session.delete(project)
    db.session.commit()
    return jsonify({"message": "Deleted successfully"}), 200

# ==============================
# Initialize DB
# ==============================
with app.app_context():
    db.create_all()
    print("Database ready.")

# ==============================
# Run App (Render uses PORT env variable)
# ==============================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)