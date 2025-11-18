// src/components/users/RolesSelector.jsx
export default function RolesSelector({ value = [], onChange }) {
  const roles = ["admin", "manager", "cashier"];

  const toggleRole = (role) => {
    if (value.includes(role)) {
      onChange(value.filter((r) => r !== role));
    } else {
      onChange([...value, role]);
    }
  };

  return (
    <div className="flex gap-3 flex-wrap">
      {roles.map((role) => (
        <button
          key={role}
          type="button"
          onClick={() => toggleRole(role)}
          className={`px-3 py-1 rounded-md border ${
            value.includes(role)
              ? "bg-blue-600 text-white border-blue-700"
              : "border-gray-500"
          }`}
        >
          {role.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
