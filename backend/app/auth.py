import functools
import json
import logging

from flask import (
    Blueprint,
    Response,
    g,
    redirect,
    request,
    session,
    url_for,
)

from http import HTTPStatus

from werkzeug.security import check_password_hash, generate_password_hash

from .db import get_db

from . import getSetDB

bp = Blueprint("auth", __name__, url_prefix="/auth")


# @bp.route("/register", methods=["POST"])
# def register():
#     username = request.form["username"]
#     password = request.form["password"]
#     db = get_db()
#     error = None

#     if not username:
#         error = "Username is required."
#     elif not password:
#         error = "Password is required."

#     if error is None:
#         try:
#             db.execute(
#                 "INSERT INTO user (username, password) VALUES (?, ?)",
#                 (username, generate_password_hash(password)),
#             )
#             db.commit()
#         except db.IntegrityError:
#             error = f"User {username} is already registered."
#         else:
#             return Response(
#                 json.dumps(
#                     {
#                         "username": username,
#                     }
#                 ),
#                 HTTPStatus.CREATED,
#                 mimetype="application/json",
#             )

#     return Response(
#         json.dumps({"message": "Account could not be created", "reason": f"{error}"}),
#         HTTPStatus.CONFLICT,
#         mimetype="application/json",
#     )

@bp.route("/register", methods=["POST"])
def register():
    username = request.form["username"]
    password = request.form["password"]

    error = None

    if not username:
        error = "Username is required"
    elif not password:
        error = "Password is required"

    if error is None:
        error = getSetDB.set_user(username, generate_password_hash(password))
    
    if error is None:
        return Response(
            json.dumps(
                {
                    "username": username,
                }
            ),
            HTTPStatus.CREATED,
            mimetype="application/json",
        )
    else:
        return Response (
            json.dump({"message": "Account could not be created"}),
            HTTPStatus.CONFLICT,
            mimetype="application/json",
        )

# @bp.route("/login", methods=["POST"])
# def login():
#     username = request.form["username"]
#     password = request.form["password"]
#     db = get_db()
#     error = None
#     user = db.execute("SELECT * FROM user WHERE username = ?", (username,)).fetchone()

#     if user is None:
#         error = "Incorrect username."
#     elif not check_password_hash(user["password"], password):
#         error = "Incorrect password."

#     if error is None:
#         session.clear()
#         session["user_id"] = user["id"]
#         return Response(
#             json.dumps({"username": username}),
#             HTTPStatus.OK,
#             mimetype="application/json",
#         )

@bp.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]
    error = None

    user = json.loads(getSetDB.get_user(username))

    if user is None:
        error = "Incorrect username."
    elif not check_password_hash(user["password"], password):
        error = "Incorrect password."

    if error is None:
        session.clear()
        session["user_id"] = user["id"]
        return Response(
            json.dumps({"username": username}),
            HTTPStatus.OK,
            mimetype="application/json",
        )


    return Response(
        json.dumps({"message": "Login failed", "reason": error}),
        HTTPStatus.UNAUTHORIZED,
        mimetype="application/json",
    )

def get_logged_in_user():
    user_id = session.get("user_id")
    return user_id

@bp.before_app_request
def load_logged_in_user():
    user_id = session.get("user_id")
    if user_id is None:
        g.user = None
    else:
        user = json.loads(getSetDB.get_user_id(user_id))
        g.user = (
            # get_db().execute("SELECT * FROM user WHERE id = ?", (user_id,)).fetchone()
            user["id"]
        )

def get_logged_in_user():
    return session.get("user_id")

@bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return Response(status=HTTPStatus.OK)


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return Response("User is not logged in", 401)

        return view(**kwargs)

    return wrapped_view
