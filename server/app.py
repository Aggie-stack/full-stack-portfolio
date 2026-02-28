from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///projects.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# =========================
# DATABASE MODEL
# =========================

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    github = db.Column(db.String(250), nullable=False)
    demo = db.Column(db.String(250), nullable=True) 

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "github": self.github,
            "demo": self.demo  
        }

# Create database tables
with app.app_context():
    db.create_all()

# =========================
# ROUTES
# =========================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Backend is running",
        "status": "success"
    })

# GET ALL PROJECTS
@app.route("/projects", methods=["GET"])
def get_projects():
    projects = Project.query.all()
    return jsonify([p.to_dict() for p in projects])

# ADD PROJECT
@app.route("/projects", methods=["POST"])
def add_project():
    data = request.json

    project = Project(
        title=data["title"],
        description=data["description"],
        github=data["github"],
        demo=data.get("demo") 
    )

    db.session.add(project)
    db.session.commit()

    return jsonify(project.to_dict()), 201

# UPDATE PROJECT
@app.route("/projects/<int:id>", methods=["PUT"])
def update_project(id):
    project = Project.query.get(id)

    if not project:
        return jsonify({"error": "Project not found"}), 404

    data = request.json

    project.title = data.get("title", project.title)
    project.description = data.get("description", project.description)
    project.github = data.get("github", project.github)
    project.demo = data.get("demo", project.demo)  # ✅ UPDATE DEMO

    db.session.commit()

    return jsonify(project.to_dict())

# DELETE PROJECT
@app.route("/projects/<int:id>", methods=["DELETE"])
def delete_project(id):
    project = Project.query.get(id)

    if not project:
        return jsonify({"error": "Project not found"}), 404

    db.session.delete(project)
    db.session.commit()

    return jsonify({"message": "Deleted"}), 200

# CONTACT ROUTE
@app.route("/contact", methods=["POST"])
def contact():
    data = request.get_json()
    print(
        f"Message from {data.get('name')} "
        f"({data.get('email')}): {data.get('message')}"
    )
    return jsonify({"success": True, "message": "Message received!"})

# =========================
# RUN APP
# =========================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)