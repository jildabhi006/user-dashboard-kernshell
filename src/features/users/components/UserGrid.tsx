import React from 'react';
import { User } from '../types/user.types';
import { UserCard } from './UserCard';

interface UserGridProps {
  users: User[];
}

export const UserGrid: React.FC<UserGridProps> = ({ users }) => {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 animate-fade-in"
      role="region"
      aria-label="User grid"
    >
      {users.map((user, index) => (
        <div
          key={user.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${Math.min(index * 30, 240)}ms` }}
        >
          <UserCard user={user} />
        </div>
      ))}
    </div>
  );
};
