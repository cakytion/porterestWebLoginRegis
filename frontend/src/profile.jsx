import { useEffect, useState } from 'react';
import { getPortfolio } from './api/portfolio';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import styles from './Profile.module.css'; // Import CSS Module

export default function Profile() {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [activeTab, setActiveTab] = useState('created'); // 'created' | 'saved'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchUserPortfolios();
    }
  }, [user]);

  const fetchUserPortfolios = async () => {
    try {
      const res = await getUserPortfolios(user.id);
      if (res.success) setPortfolios(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Mock user avatar (ใช้ seed จาก email)
  const avatarUrl = user?.email 
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}` 
    : 'https://via.placeholder.com/150';

  const username = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const handle = `@${user?.email?.split('@')[0]}`;

  return (
    <div className={styles.container}>
      {/* --- Header Section --- */}
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          <img src={avatarUrl} alt="Avatar" className={styles.avatar} />
        </div>
        
        <h1 className={styles.username}>{username}</h1>
        <p className={styles.handle}>{handle}</p>
        
        <div className={styles.stats}>
          <span>0 followers</span> • <span>0 following</span>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnSecondary}>Share</button>
          <Link to="/settings" className={styles.btnSecondary}>Edit Profile</Link>
        </div>
      </div>

      {/* --- Tabs Section --- */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabItem} ${activeTab === 'created' ? styles.active : ''}`}
          onClick={() => setActiveTab('created')}
        >
          Created
        </button>
        <button 
          className={`${styles.tabItem} ${activeTab === 'saved' ? styles.active : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved
        </button>
      </div>

      {/* --- Grid Content --- */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : activeTab === 'created' ? (
          
          portfolios.length > 0 ? (
            <div className={styles.masonryGrid}>
              {portfolios.map((item) => (
                <div key={item.id} className={styles.pinItem}>
                  <img 
                    src={item.portfolio_images?.[0]?.image_url} 
                    alt={item.title} 
                    className={styles.pinImage} 
                  />
                  <div className={styles.overlay}>
                    <button className={styles.btnSave}>Save</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Nothing to show...yet! Pins you create will live here.</p>
              <Link to="/create" className={styles.btnPrimary}>Create Pin</Link>
            </div>
          )

        ) : (
          // Saved Tab Placeholder
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📌</div>
            <p>You haven't saved any Pins yet</p>
          </div>
        )}
      </div>
    </div>
  );
}