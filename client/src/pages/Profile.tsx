import { useEffect, useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Loader2,
  Save,
  ShieldCheck,
  UserCircle,
  X,
} from "lucide-react";

import {
  getMyProfile,
  updateMyPassword,
  updateMyProfile,
} from "../services/userService";

import type { UserProfile } from "../types/auth";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { updateUser } = useAuth();

  // Profile form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setProfileError("");

        const data = await getMyProfile();

        setProfile(data);
        setUsername(data.username);
        setEmail(data.email);
        setAvatar(data.avatar || "");
      } catch (error: any) {
        setProfileError(
          error.response?.data?.message ||
            "Failed to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfileSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setProfileError("");
    setProfileSuccess("");

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedAvatar = avatar.trim();

    if (trimmedUsername.length < 3) {
      setProfileError(
        "Username must be at least 3 characters long."
      );
      return;
    }

    if (!trimmedEmail) {
      setProfileError("Email is required.");
      return;
    }

    try {
      setSavingProfile(true);

      const updatedProfile = await updateMyProfile({
        username: trimmedUsername,
        email: trimmedEmail,
        avatar: trimmedAvatar || undefined,
      });

      setProfile((current) =>
        current
          ? {
              ...current,
              username: updatedProfile.username,
              email: updatedProfile.email,
              avatar: updatedProfile.avatar,
            }
          : current
      );

      updateUser({
        username: updatedProfile.username,
        email: updatedProfile.email,
        avatar: updatedProfile.avatar,
      });

      setUsername(updatedProfile.username);
      setEmail(updatedProfile.email);
      setAvatar(updatedProfile.avatar || "");

      setProfileSuccess(
        "Profile information updated successfully."
      );
    } catch (error: any) {
      setProfileError(
        error.response?.data?.message ||
          "Failed to update your profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters."
      );
      return;
    }

    try {
      setSavingPassword(true);

      const response = await updateMyPassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordSuccess(response.message);

      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 1500);
    } catch (error: any) {
      setPasswordError(
        error.response?.data?.message ||
          "Failed to update your password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />

          <p className="mt-3 text-sm text-gray-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl">
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-red-700"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <p className="text-sm font-medium">
            {profileError || "Unable to load your profile."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <UserCircle className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Profile
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your account information and password.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <section className="ui-card p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <UserCircle className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Profile Information
            </h2>

            <p className="text-sm text-gray-500">
              Update your personal account information.
            </p>
          </div>
        </div>

        {profileError && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <p>{profileError}</p>
          </div>
        )}

        {profileSuccess && (
          <div
            role="status"
            className="mb-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <p>{profileSuccess}</p>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          {/* Avatar Preview */}
          <div className="flex items-center gap-4">
            {avatar ? (
              <img
                src={avatar}
                alt={`${profile.username}'s avatar`}
                className="h-16 w-16 rounded-full border border-gray-200 object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <UserCircle className="h-9 w-9" />
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-900">
                Profile avatar
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Enter an image URL below to update your avatar.
              </p>
            </div>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="ui-label">
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="ui-input"
              placeholder="Enter your username"
              autoComplete="username"
              maxLength={50}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="ui-label">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="ui-input"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          {/* Avatar */}
          <div>
            <label htmlFor="avatar" className="ui-label">
              Avatar URL
            </label>

            <input
              id="avatar"
              type="url"
              value={avatar}
              onChange={(event) => setAvatar(event.target.value)}
              className="ui-input"
              placeholder="https://example.com/avatar.jpg"
              autoComplete="url"
            />
          </div>

          {/* Account Information */}
          <div className="grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />

                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Role
                </p>
              </div>

              <p className="mt-2 text-sm font-semibold capitalize text-gray-900">
                {profile.role}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />

                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Account Status
                </p>
              </div>

              <p className="mt-2 text-sm font-semibold capitalize text-gray-900">
                {profile.status}
              </p>
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-5">
            <button
              type="submit"
              disabled={savingProfile}
              className="ui-button-primary w-full gap-2 sm:w-auto"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Change Password */}
      <section className="ui-card p-5 sm:p-6">
        <section className="ui-card p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <KeyRound className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Password
                </h2>

                <p className="text-sm text-gray-500">
                  Keep your account secure with a strong password.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setPasswordError("");
                setPasswordSuccess("");
                setShowPasswordModal(true);
              }}
              className="ui-button-secondary w-full gap-2 sm:w-auto"
            >
              <KeyRound className="h-4 w-4" />
              Change Password
            </button>
          </div>
        </section>
        {showPasswordModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowPasswordModal(false);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="change-password-title"
              className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 shadow-xl animate-in fade-in zoom-in-95 duration-200 sm:p-6"
            >
              {/* Modal Header */}
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <KeyRound className="h-5 w-5" />
                  </div>

                  <div>
                    <h2
                      id="change-password-title"
                      className="text-lg font-semibold text-gray-900"
                    >
                      Change Password
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Enter your current password and choose a new one.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Close change password dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Errors / Success */}
              {passwordError && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div
                  role="status"
                  className="mb-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>{passwordSuccess}</p>
                </div>
              )}

              {/* Password Form */}
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label htmlFor="currentPassword" className="ui-label">
                    Current Password
                  </label>

                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                    className="ui-input"
                    placeholder="Enter your current password"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="ui-label">
                    New Password
                  </label>

                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                    className="ui-input"
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />

                  <p className="mt-1.5 text-xs text-gray-500">
                    At least 8 characters with at least one letter and one
                    number.
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="ui-label">
                    Confirm New Password
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    className="ui-input"
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="ui-button-secondary w-full sm:w-auto"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="ui-button-primary w-full gap-2 sm:w-auto"
                  >
                    {savingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;