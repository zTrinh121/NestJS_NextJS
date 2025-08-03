'use client'
import { Layout } from "antd";
import React from "react";

const AdminContent = ({ children }: { children: React.ReactNode }) => {
  const { Content } = Layout;

  return (
    <Content style={{ margin: "24px 16px 0" }}>
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: "#ccc",
          borderRadius: "10px",
        }}
      >
        {children}
      </div>
    </Content>
  );
};

export default AdminContent;
