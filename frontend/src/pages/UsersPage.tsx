import React, { useEffect, useState } from "react";
import api from "../api/client";
import Pagination from "../components/Pagination";
import TableShell from "../components/TableShell";
import { usePagination } from "../hooks/usePagination";
import { PaginatedResponse, PaginationMeta, User } from "../types";

const UsersPage = () => {
  const { page, setPage, limit } = usePagination();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>();

  useEffect(() => {
    api.get<PaginatedResponse<User>>(`/api/auth/users?page=${page}&limit=${limit}`).then((response) => {
      setUsers(response.data.data);
      setPagination(response.data.pagination);
    });
  }, [page, limit]);

  return (
    <TableShell title="Registered users">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-slate-500">
          <tr>
            <th className="py-3">Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-slate-100">
              <td className="py-3 font-medium text-slate-900">{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination meta={pagination} onChange={setPage} />
    </TableShell>
  );
};

export default UsersPage;
