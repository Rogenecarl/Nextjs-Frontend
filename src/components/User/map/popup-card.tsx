import { CategoryProps } from "@/types/types";



export interface PopupCardProps {
  feature: any;
  categoryData: {
    color: string;
    icon: string;
    name: string;
  };
}

// Create popup content for provider details
export const createPopupContent = (
  feature: any,
  categoryData: { color: string; icon: string; name: string }
): string => {
  const { color, icon, name: categoryName } = categoryData;
  const provider = feature.properties;

  return `
    <div class="provider-card">
      <!-- Image Header with Overlays -->
      <div class="card-header">
        ${
          provider?.cover_photo
            ? `<img 
                src="${provider.cover_photo}" 
                alt="${provider?.name || provider?.healthcare_name}"
                class="header-image"
              />`
            : `<div class="header-placeholder" style="background: linear-gradient(135deg, ${color}20 0%, ${color}40 100%);">
                <div class="placeholder-icon" style="color: ${color};">
                  ${icon}
                </div>
              </div>`
        }
        
        <!-- Status Badge - Top Left -->
        <div class="status-badge">
          <svg class="status-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
          </svg>
          Open
        </div>

        <!-- Action Buttons - Top Right -->
        <div class="header-actions">
          <button class="action-btn favorite-btn">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>
          <button class="action-btn share-btn">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Card Content -->
      <div class="card-content">
        <!-- Title and Distance -->
        <div class="title-section">
          <h3 class="provider-title">${
            provider?.name || provider?.healthcare_name || "Healthcare Provider"
          }</h3>
          <span class="distance">1.5 km</span>
        </div>

        <!-- Category Badge -->
        <div class="category-section">
          <div class="category-badge" style="background-color: ${color};">
            ${categoryName}
          </div>
        </div>

        <!-- Rating -->
        <div class="rating-section">
          <div class="stars">
            ${Array.from(
              { length: 4 },
              () => `
              <svg class="star filled" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            `
            ).join("")}
            <svg class="star empty" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <span class="rating-text">4.7</span>
          <span class="review-count">(128 reviews)</span>
        </div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Contact Information -->
        <div class="contact-section">
          <div class="contact-item">
            <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
            </svg>
            <span class="contact-text">${(() => {
              const parts = [];
              if (provider?.address) parts.push(provider.address);
              if (provider?.city) parts.push(provider.city);
              if (provider?.province) parts.push(provider.province);
              return parts.length > 0
                ? parts.join(", ")
                : "Address not available";
            })()}</span>
          </div>
          
          ${
            provider?.phone_number
              ? `
            <div class="contact-item">
              <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              <a href="tel:${provider.phone_number}" class="contact-link">${provider.phone_number}</a>
            </div>
          `
              : ""
          }
          
          ${
            provider?.email
              ? `
            <div class="contact-item">
              <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <a href="mailto:${provider.email}" class="contact-link">${provider.email}</a>
            </div>
          `
              : ""
          }
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button 
            class="primary-btn" 
            style="background-color: ${color};"
            onclick="window.location.href='/providerdetails/${provider?.id}'"
          >
            View Details
          </button>
          <button 
            class="secondary-btn"
            onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${
              feature.geometry.coordinates[1]
            },${feature.geometry.coordinates[0]}', '_blank')"
          >
            Get Directions
          </button>
        </div>
      </div>
    </div>`;
};


// Popup styles that need to be injected into the document
export const popupStyles = `
  .mapboxgl-popup-content {
    border-radius: 16px !important;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
    border: none !important;
    padding: 0 !important;
    overflow: hidden !important;
    max-width: 280px !important;
    min-width: 260px !important;
    position: relative !important;
    animation: fadeInUp 0.3s ease-out !important;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .mapboxgl-popup-tip {
    display: none !important;
  }
  
  .mapboxgl-popup-close-button {
    display: none !important;
  }

  /* Provider Card */
  .provider-card {
    width: 100%;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
  }

  /* Card Header */
  .card-header {
    position: relative;
    height: 140px;
    overflow: hidden;
  }

  .header-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .header-image:hover {
    transform: scale(1.05);
  }

  .header-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .placeholder-icon {
    font-size: 32px;
    font-weight: 600;
  }

  /* Status Badge */
  .status-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    color: #374151;
    padding: 6px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .status-icon {
    width: 12px;
    height: 12px;
  }

  /* Header Actions */
  .header-actions {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    gap: 6px;
  }

  .action-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .action-btn:hover {
    background: white;
    transform: scale(1.05);
  }

  .btn-icon {
    width: 16px;
    height: 16px;
    color: #6b7280;
  }

  /* Card Content */
  .card-content {
    padding: 16px;
  }

  /* Title Section */
  .title-section {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
  }

  .provider-title {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin: 0;
    line-height: 1.3;
    flex: 1;
  }

  .distance {
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    white-space: nowrap;
  }

  /* Category Section */
  .category-section {
    margin-bottom: 12px;
  }

  .category-badge {
    display: inline-block;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
    color: white;
    border-radius: 12px;
  }

  /* Rating Section */
  .rating-section {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
  }

  .stars {
    display: flex;
    gap: 1px;
  }

  .star {
    width: 14px;
    height: 14px;
  }

  .star.filled {
    color: #fbbf24;
  }

  .star.empty {
    color: #e5e7eb;
  }

  .rating-text {
    font-size: 13px;
    font-weight: 700;
    color: #111827;
  }

  .review-count {
    font-size: 12px;
    color: #6b7280;
  }

  /* Divider */
  .divider {
    height: 1px;
    background: #f3f4f6;
    margin: 12px 0;
  }

  /* Contact Section */
  .contact-section {
    margin-bottom: 16px;
  }

  .contact-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
  }

  .contact-item:last-child {
    margin-bottom: 0;
  }

  .contact-icon {
    width: 14px;
    height: 14px;
    color: #9ca3af;
    margin-top: 1px;
    flex-shrink: 0;
  }

  .contact-text {
    font-size: 13px;
    color: #374151;
    line-height: 1.4;
  }

  .contact-link {
    font-size: 13px;
    color: #374151;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .contact-link:hover {
    color: #3b82f6;
  }

  /* Action Buttons */
  .action-buttons {
    display: flex;
    gap: 8px;
    padding-top: 4px;
  }

  .primary-btn, .secondary-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .primary-btn {
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .secondary-btn {
    background: transparent;
    color: #374151;
    border: 1px solid #e5e7eb;
  }

  .primary-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .secondary-btn:hover {
    background: #f9fafb;
  }

  .primary-btn .btn-icon,
  .secondary-btn .btn-icon {
    width: 14px;
    height: 14px;
  }

  /* Responsive Design */
  @media (max-width: 480px) {
    .mapboxgl-popup-content {
      max-width: 260px !important;
      min-width: 240px !important;
    }

    .card-header {
      height: 120px;
    }

    .card-content {
      padding: 14px;
    }

    .provider-title {
      font-size: 16px;
    }

    .action-buttons {
      flex-direction: column;
    }

    .primary-btn, .secondary-btn {
      width: 100%;
    }
  }

  @media (max-width: 360px) {
    .mapboxgl-popup-content {
      max-width: 240px !important;
      min-width: 220px !important;
    }

    .card-header {
      height: 100px;
    }

    .card-content {
      padding: 12px;
    }

    .provider-title {
      font-size: 15px;
    }

    .contact-text, .contact-link {
      font-size: 12px;
    }
  }
`;
