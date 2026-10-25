import React from 'react';
import { Github, Calendar, Shield, ExternalLink, Code2, CheckCircle2, UserCheck } from 'lucide-react';
import { DashboardUser } from '../../types/dashboard';
import { useTheme } from '../../context/ThemeContext';

interface UserInfoCardProps {
  user: DashboardUser;
  totalRepos: number;
  isLoading?: boolean;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({
  user,
  totalRepos,
  isLoading = false,
}) => {
  const { isDark } = useTheme();

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recently';

  if (isLoading) {
    return (
      <div
        className={`w-full rounded-2xl border p-6 sm:p-8 animate-pulse ${
          isDark
            ? 'bg-[#1E2328] border-[#5B6770]/40'
            : 'bg-white border-[#5B6770]/25'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#5B6770]/30 shrink-0" />
          <div className="space-y-3 w-full">
            <div className="h-6 w-48 bg-[#5B6770]/30 rounded-md" />
            <div className="h-4 w-32 bg-[#5B6770]/30 rounded-md" />
            <div className="h-4 w-64 bg-[#5B6770]/20 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="dashboard-user-card"
      className={`w-full rounded-2xl border p-6 sm:p-8 transition-all duration-200 shadow-md relative overflow-hidden ${
        isDark
          ? 'bg-[#1E2328] border-[#5B6770]/50 text-[#FFF4D6]'
          : 'bg-white border-[#5B6770]/25 text-[#2A2F35]'
      }`}
    >
      {/* Decorative top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F2C14E] via-[#F5B838] to-[#F2C14E]" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Avatar & Identity Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar with status ring */}
          <div className="relative shrink-0">
            <img
              src={user.avatarUrl || 'https://github.com/github.png'}
              alt={`${user.name || user.githubLogin}'s avatar`}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#F2C14E] shadow-sm select-none"
              onError={(e) => {
                e.currentTarget.src = 'https://github.com/github.png';
              }}
            />
            <div
              className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-[#F2C14E] text-[#2A2F35] shadow-sm"
              title="Verified GitHub Account"
            >
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* Name & Credentials */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {user.name || user.githubLogin}
              </h1>

              {/* Role badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-[#F2C14E]/20 text-[#F2C14E] border border-[#F2C14E]/40">
                <UserCheck className="w-3.5 h-3.5" />
                {user.role}
              </span>

              {/* Provider chip */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isDark
                    ? 'bg-[#2A2F35] text-[#FFF4D6]/80 border border-[#5B6770]/40'
                    : 'bg-[#FFF4D6] text-[#2A2F35]/80 border border-[#5B6770]/20'
                }`}
              >
                <Github className="w-3 h-3" />
                {user.provider}
              </span>
            </div>

            <p
              className={`text-sm sm:text-base font-mono ${
                isDark ? 'text-[#FFF4D6]/70' : 'text-[#2A2F35]/70'
              }`}
            >
              @{user.githubLogin}
            </p>

            <div
              className={`flex flex-wrap items-center gap-4 text-xs pt-1 ${
                isDark ? 'text-[#FFF4D6]/60' : 'text-[#2A2F35]/60'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#F2C14E]" />
                Joined {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#F2C14E]" />
                {totalRepos} Repositories Evaluated
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Shield className="w-3.5 h-3.5 text-[#F2C14E]" />
                ID: {user.id.slice(0, 8)}...
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          <a
            id="view-github-profile-button"
            href={`https://github.com/${user.githubLogin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-[#F2C14E] text-[#2A2F35] hover:bg-[#FFF4D6] hover:shadow-md transition-all duration-200"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Profile</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
