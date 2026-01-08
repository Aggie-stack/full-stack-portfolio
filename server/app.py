from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

# Setup SQLite database for projects
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///projects.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database model for Projects
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    github = db.Column(db.String(250), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "github": self.github
        }

# Create database tables
with app.app_context():
    db.create_all()

# ====================
# Routes
# ====================

# Health check route
@app.route("/", methods=["GET"])
def home():
    return jsonify({
       "message": "Backend is running",
       "status": "success"
    })

# Projects routes
@app.route("/projects", methods=["GET"])
def get_projects():
    all_projects = Project.query.all()
    return jsonify([p.to_dict() for p in all_projects])

@app.route("/projects", methods=["POST"])
def add_project():
    data = request.json
    new_project = Project(
        title=data["title"],
        description=data["description"],
        github=data["github"]
    )
    db.session.add(new_project)
    db.session.commit()
    return jsonify(new_project.to_dict()), 201

@app.route("/projects/<int:id>", methods=["PUT"])
def update_project(id):
    project = Project.query.get(id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    data = request.json
    project.title = data.get("title", project.title)
    project.description = data.get("description", project.description)
    project.github = data.get("github", project.github)
    db.session.commit()
    return jsonify(project.to_dict())

@app.route("/projects/<int:id>", methods=["DELETE"])
def delete_project(id):
    project = Project.query.get(id)
    if not project:
        return jsonify({"error": "Project not found"}), 404
    db.session.delete(project)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200

# Contact form route
@app.route("/contact", methods=["POST"])
def contact():
    data = request.get_json()
    
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")
    
    # For now, we just print it in the backend console
    print(f"New message from {name} ({email}): {message}")
    
    # You could later save to a database or send an email
    
    return jsonify({"success": True, "message": "Message received!"})

# ====================
# Run the app
# ====================
if __name__ == "__main__":
    app.run(debug=True)
