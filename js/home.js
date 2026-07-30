<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>REMADEF Platform | Dashboard</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://googleapis.com">
    <link rel="preconnect" href="https://gstatic.com" crossorigin>
    <link href="https://googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Lucide Icons Core Framework -->
    <script src="https://unpkg.com"></script>
    
    <!-- Platform Master CSS Setup -->
    <link rel="stylesheet" href="css/home.css">
</head>
<body>

    <div class="app">
        
        <!-- HEADER COMPONENT -->
        <header class="header">
            <div class="header-left">
                <button id="sidebarToggle" class="menu-toggle" aria-label="Toggle Sidebar">
                    <i data-lucide="menu"></i>
                </button>
                
                <div class="brand" id="brandButton">
                    <div class="brand-logo">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://w3.org">
                            <rect width="100" height="100" rx="24" fill="#071A3D"/>
                            <path d="M28 72V28L50 50L72 28V72" stroke="#2563EB" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="50" cy="24" r="8" fill="#22C55E"/>
                        </svg>
                    </div>
                    <span class="brand-name">REMADEF</span>
                    <i data-lucide="chevron-down" class="brand-chevron"></i>
                    
                    <!-- BRAND DROPDOWN HUB MENU -->
                    <div class="brand-dropdown" id="brandDropdown">
                        <a href="home.html">
                            <i data-lucide="layout-dashboard"></i>
                            <span>Dashboard Hub</span>
                        </a>
                        <a href="profile.html">
                            <i data-lucide="building"></i>
                            <span>Enterprise Portal</span>
                        </a>
                        <a href="settings.html">
                            <i data-lucide="sliders"></i>
                            <span>System Settings</span>
                        </a>
                    </div>
                </div>
            </div>

            <!-- ENGINE SEARCH BAR -->
            <div class="search-wrapper">
                <i data-lucide="search"></i>
                <input type="text" placeholder="Search enterprise programs, messages, trade corridors...">
            </div>

            <!-- HEADER RIGHT INTERACTIONS -->
            <div class="header-right">
                <button class="notification-btn" id="notificationToggle" aria-label="Notifications">
                    <i data-lucide="bell"></i>
                    <span class="badge">3</span>
                </button>
                
                <div class="avatar" id="userAvatar">
                    <span>OK</span>
                </div>
            </div>
            
            <!-- NOTIFICATIONS PANEL EXTENSION -->
            <div class="notifications-panel hidden" id="notificationsPanel">
                <div class="panel-header">System Notifications</div>
                <div class="panel-body">
                    <div class="notification-item">
                        <strong>Escrow Verification</strong> Secure node payment received.
                    </div>
                    <div class="notification-item">
                        <strong>Logistics Update</strong> Trade corridor Node #4 modified.
                    </div>
                    <div class="notification-item">
                        <strong>System Account</strong> Connected token status valid.
                    </div>
                </div>
            </div>
        </header>

        <!-- LAYOUT NAVIGATION / CONTENT WRAPPER -->
        <div class="layout">
            
            <!-- SIDEBAR NAVIGATION SYSTEM -->
            <aside class="sidebar" id="sidebar">
                <div>
                    <div class="sidebar-title">NAVIGATION</div>
                    <nav class="sidebar-nav">
                        <a href="home.html" class="active">
                            <i data-lucide="house"></i>
                            <span>Home</span>
                        </a>
                        <a href="profile.html">
                            <i data-lucide="user"></i>
                            <span>My Profile</span>
                        </a>
                        <a href="messages.html">
                            <i data-lucide="message-square"></i>
                            <span>Messages</span>
                            <span class="menu-badge">2</span>
                        </a>
                        <a href="learning.html">
                            <i data-lucide="book-open"></i>
                            <span>Learning Hub</span>
                        </a>
                        <a href="apprenticeship.html">
                            <i data-lucide="graduation-cap"></i>
                            <span>Apprenticeship</span>
                        </a>
                        <a href="business.html">
                            <i data-lucide="building-2"></i>
                            <span>Business & Gigs</span>
                        </a>

                        <!-- ACCESSIBLE CONTROL SYSTEMS -->
                        <div class="sidebar-title" style="margin-top: 16px;">MORE</div>
                        <a href="wallet.html">
                            <i data-lucide="wallet"></i>
                            <span>Wallet</span>
                            <span class="menu-badge">₦</span>
                        </a>
                        <a href="escrow.html">
                            <i data-lucide="shield-check"></i>
                            <span>Escrow</span>
                        </a>
                        <a href="gigs-directory.html">
                            <i data-lucide="briefcase"></i>
                            <span>Gig Engine & Directory</span>
                        </a>
                        <a href="settings.html">
                            <i data-lucide="sliders"></i>
                            <span>Platform Settings</span>
                        </a>
                        <a href="help.html">
                            <i data-lucide="help-circle"></i>
                            <span>Help & Support</span>
                        </a>
                        <a href="logout.html" class="logout-link">
                            <i data-lucide="log-out"></i>
                            <span>Sign Out</span>
                        </a>
                    </nav>
                </div>

                <!-- SIDEBAR METRIC PROGRESS FOOTER -->
                <div class="sidebar-footer">
                    <div class="profile-progress">
                        <div class="progress-header">
                            <span>Profile Completion</span>
                            <span>85%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 85%;"></div>
                        </div>
                        <button class="complete-profile-btn" onclick="window.location.href='profile.html'">
                            Update Profile
                        </button>
                    </div>
                    <div class="copyright">
                        &copy; 2026 REMADEF Ltd.
                    </div>
                </div>
            </aside>

            <!-- MAIN PLATFORM CORE CONTENT FIELD -->
            <main class="main">
                
                <!-- DASHBOARD BANNER -->
                <section class="welcome">
                    <div>
                        <h1>Welcome Back, Onyekachi</h1>
                        <p>Monitor your project workflows, trade corridors, and active platform programs.</p>
                    </div>
                    <div class="platform-status">
                        <span class="status-dot"></span>
                        <span id="apiStatus">System Operational</span>
                    </div>
                </section>

                <!-- REALTIME DATA METRIC CARDS -->
                <section class="dashboard-cards">
                    <div class="dashboard-card">
                        <div class="card-icon blue">
                            <i data-lucide="briefcase"></i>
                        </div>
                        <div class="card-content">
                            <span class="card-title">Active Projects</span>
                            <h2>12</h2>
                            <small>+2 added this month</small>
                        </div>
                    </div>
                </section>

                <!-- ASYNC INFINITE SCROLL OPPORTUNITIES MODULE -->
                <section class="opportunities-section">
                    <h2>Available System Opportunities</h2>
                    <div class="opportunity-list">
                        <div class="opportunity-card" onclick="window.location.href='opportunities.html'">
                            <div class="opportunity-icon">
                                <i data-lucide="briefcase"></i>
                            </div>
                            <div>
                                <h3>Trade Corridor Expansion Node #1</h3>
                                <p>Consortium fulfillment & regional logistical distribution node model.</p>
                            </div>
                        </div>
