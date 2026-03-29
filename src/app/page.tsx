"use client";

import { useState, useEffect, useCallback } from "react";

interface StatusData {
  status: string;
  next_scheduled: string;
  recipient: string;
  timestamp: string;
}

const defaultBlogPosts = [
  {
    title: "Navigating the Digital Landscape: Inclusive UX for Healthcare in London",
    description: "Focused on healthcare providers embracing inclusive design and accessibility.",
  },
  {
    title: "Scaling Up: User-Centric Design for Tech Start-ups in Manchester",
    description: "Targeting growth-focused start-ups needing bold design and user insights.",
  },
  {
    title: "Ethical AI in the Silicon Glen: Building Trust in Edinburgh\'s Tech Scene",
    description: "Addressing AI companies balancing innovation with ethical design.",
  },
  {
    title: "Transforming Giants: Digital Transformation in Glasgow\'s Corporate Landscape",
    description: "Large enterprises undergoing digital transformation and culture change.",
  },
  {
    title: "Amplifying Voices: Inclusive Design for Social Impact in Bristol",
    description: "NGOs and social impact organisations needing accessible, values-driven design.",
  },
];

export default function Home() {
  const [statusData, setStatusData] = useState<StatusData>({
    status: "running",
    next_scheduled: "09:00 daily",
    recipient: "paul@designedforhumans.tech",
    timestamp: new Date().toISOString(),
  });
  const [message, setMessage] = useState<{ text: string; type: string } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const showMessage = useCallback((text: string, type: string) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  }, []);

  const refreshStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/blog/status");
      const data = await response.json();
      setStatusData({
        status: data.status,
        next_scheduled: data.next_scheduled,
        recipient: data.recipient,
        timestamp: data.timestamp,
      });
    } catch {
      showMessage("Failed to refresh status", "error");
    }
  }, [showMessage]);

  const sendTestEmail = async () => {
    try {
      showMessage("Sending test email...", "success");
      const response = await fetch("/api/blog/send-test-email", { method: "POST" });
      if (response.ok) {
        showMessage("Test email sent successfully!", "success");
      } else {
        showMessage("Failed to send test email", "error");
      }
    } catch {
      showMessage("Error sending test email", "error");
    }
  };

  const configureEmail = async () => {
    if (!email || !password) {
      showMessage("Please fill in both email and password", "error");
      return;
    }
    try {
      const response = await fetch("/api/blog/configure-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_address: email, email_password: password }),
      });
      if (response.ok) {
        showMessage("Email configuration updated successfully!", "success");
        setEmail("");
        setPassword("");
      } else {
        showMessage("Failed to update email configuration", "error");
      }
    } catch {
      showMessage("Error updating email configuration", "error");
    }
  };

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  return (
    <div className="container">
      <h1>Blog Automation Dashboard</h1>
      <div id="message-container">
        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
      </div>
      <div className="status-card">
        <h3>System Status</h3>
        <p><strong>Status:</strong> {statusData.status}</p>
        <p><strong>Next Scheduled:</strong> {statusData.next_scheduled}</p>
        <p><strong>Recipient:</strong> {statusData.recipient}</p>
        <p><strong>Last Updated:</strong> {new Date(statusData.timestamp).toLocaleString()}</p>
      </div>
      <div className="button-group">
        <button onClick={sendTestEmail}>Send Test Email</button>
        <button onClick={refreshStatus}>Refresh Status</button>
      </div>
      <h3>Email Configuration</h3>
      <div className="form-group">
        <label><strong>Email Address:</strong></label>
        <input type="email" id="email" placeholder="your-email@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label><strong>App Password:</strong></label>
        <input type="password" id="password" placeholder="Your Gmail app password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={configureEmail} style={{ marginBottom: "20px" }}>Update Configuration</button>
      <div className="blog-list">
        <h3>Generated Blog Posts</h3>
        {defaultBlogPosts.map((post, index) => (
          <div className="blog-item" key={index}>
            <strong>{index + 1}. {post.title}</strong>
            <p>{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
