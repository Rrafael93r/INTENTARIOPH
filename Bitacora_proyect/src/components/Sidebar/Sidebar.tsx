import React from "react";
import { Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const sections = [
    {
      heading: "INTERNET",
      items: [
        {
          label: "Reportes",
          icon: "M12 9v4 M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z M12 16h.01",
          path: "/reportes",
        },
        {
          label: "Farmacias",
          icon: "M3 21l18 0 M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16 M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4 M10 9l4 0 M12 7l0 4",
          path: "/farmacias",
        },
        {
          label: "Proveedores",
          icon: "M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0 M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2 M16 3.13a4 4 0 0 1 0 7.75 M21 21v-2a4 4 0 0 0 -3 -3.85",
          path: "/proveedores",
        },
      ],
    },
    {
      heading: "INVENTARIO",
      items: [
        {
          label: "Personal",
          icon: "M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0 M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2 M16 3.13a4 4 0 0 1 0 7.75 M21 21v-2a4 4 0 0 0 -3 -3.85",
          path: "#",
        },
        {
          label: "Portatiles",
          icon: "M5 6m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z M3 19l18 0",
          path: "#",
        },
        {
          label: "Monitores",
          icon: "M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10z M7 20h10 M9 16v4 M15 16v4",
          path: "#",
        },
        {
          label: "Teclados",
          icon: "M2 6m0 2a2 2 0 0 1 2 -2h16a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2z M6 10l0 .01 M10 10l0 .01 M14 10l0 .01 M18 10l0 .01 M6 14l0 .01 M18 14l0 .01 M10 14l4 .01",
          path: "#",
        },
        {
          label: "Mouse",
          icon: "M6 3m0 4a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-4a4 4 0 0 1 -4 -4z M12 3v7 M6 10h12",
          path: "#",
        },
        {
          label: "Diademas",
          icon: "M4 14v-3a8 8 0 1 1 16 0v3 M18 19c0 1.657 -2.686 3 -6 3 M4 14a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2v-3z M15 14a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2v-3z",
          path: "#",
        },
        {
          label: "Base Refrigeradora",
          icon: "M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2z M16 16l3.3 3.3 M16 8l3.3 -3.3 M8 8l-3.3 -3.3 M8 16l-3.3 3.3",
          path: "#",
        },
      ],
    },
  ];

  return (
    <div className="sidebar col-lg-2 col-md-3 col-12 bg-white border-end vh-100">
      <div className="d-flex flex-column h-100">
        <div className="overflow-y-auto p-3">
          {sections.map((section, index) => (
            <div key={index} className="mb-4">
              <h6 className="text-muted text-uppercase small fw-bold mb-3">
                {section.heading}
              </h6>
              <ul className="nav flex-column">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="nav-item">
                    <Link
                      to={item.path}
                      className={`nav-link d-flex align-items-center gap-2 py-2 px-3 ${location.pathname === item.path
                        ? "bg-warning-subtle text-warning"
                        : "text-dark"
                        }`}
                      style={{
                        "--bs-warning-rgb": "246, 149, 44",
                        "--bs-warning-bg-subtle": "rgba(246, 149, 44, 0.1)",
                        borderRadius: "0.6rem",

                      } as React.CSSProperties}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#f6952c";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = location.pathname === item.path ? "#f6952c" : "";
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="18"
                        height="18"
                        strokeWidth="2"
                      >
                        <path d={item.icon}></path>
                      </svg>
                      <span className="small">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-auto border-top p-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <i className="bi bi-person-circle fs-5 me-2"></i>
              <span className="fw-semibold small">RROJAS</span>
            </div>
            <Button
              variant="light"
              size="sm"
              className="d-flex align-items-center p-1"
            >
              <i className="bi bi-box-arrow-right"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;