/* ==========================================================================
   FOODBRIDGE SHARED APPLICATION DATA LAYER & LOGIC (app.js)
   Vanilla JS Data Layer, LocalStorage Persistence, Lifecycle State Machine,
   Expiry Countdown Ring, Toast Notification System & Site Interactivity
   ========================================================================== */

(function () {
  'use strict';

  // Fallback In-Memory Storage if localStorage fails or is blocked
  const MemoryStore = {
    listings: null,
    couriers: null,
    ngos: null,
    needs: null,
    deliveries: null
  };

  // Keys
  const STORAGE_KEYS = {
    LISTINGS: 'fb_demo_listings',
    COURIERS: 'fb_demo_couriers',
    NGOS: 'fb_demo_ngos',
    NEEDS: 'fb_demo_needs',
    DELIVERIES: 'fb_demo_deliveries',
    USER: 'fb_auth_user'
  };

  /* --------------------------------------------------------------------------
     1. LOCALSTORAGE WRAPPERS (WITH TRY/CATCH)
     -------------------------------------------------------------------------- */
  function getItem(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch (_e) {
      return MemoryStore[key] || fallback;
    }
  }

  function setItem(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (_e) {
      MemoryStore[key] = data;
    }
  }

  /* --------------------------------------------------------------------------
     2. SEED REALISTIC INITIAL DEMO DATA
     -------------------------------------------------------------------------- */
  function seedInitialData() {
    const existingListings = getItem(STORAGE_KEYS.LISTINGS, null);
    if (existingListings && existingListings.length > 0) return; // Already seeded!

    const now = Date.now();
    const hour = 3600 * 1000;

    const seedListings = [
      {
        id: 'FB-2026-0041',
        title: '50 Servings Fresh Veg Curry & Steamed Rice',
        donorType: 'College Canteen',
        donorName: 'Campus Dining Central',
        contactPerson: 'Chef Robert',
        phone: '+1 (555) 019-2831',
        email: 'canteen@campus.edu',
        address: 'Student Union Bldg, Block C, Campus Ground',
        landmark: 'Near Central Library Gate 2',
        foodCategory: 'Veg',
        foodType: 'Cooked',
        quantity: 50,
        unit: 'servings',
        packaging: 'Sanitized Stainless Steel Tubs',
        allergens: ['gluten'],
        storage: 'Hot',
        photoUrl: '',
        preparedAt: new Date(now - hour * 1.5).toISOString(),
        expiresAt: new Date(now + hour * 2.2).toISOString(),
        pickupStart: new Date(now).toISOString(),
        pickupEnd: new Date(now + hour * 1.8).toISOString(),
        recurring: true,
        consent: true,
        status: 'available', // available | claimed | courier_assigned | picked_up | in_transit | delivered | expired
        assignedCourierId: null,
        ngoId: null,
        ngoName: null,
        createdAt: new Date(now - hour * 1.5).toISOString(),
        distanceKm: 1.2
      },
      {
        id: 'FB-2026-0042',
        title: '30 Fresh Artisan Sandwich Platter & Croissants',
        donorType: 'Bakery / Café',
        donorName: 'Green Leaf Bakery',
        contactPerson: 'Elena Rostova',
        phone: '+1 (555) 014-9920',
        email: 'elena@greenleaf.com',
        address: '445 West Elm Street',
        landmark: 'Opposite Metro Station Exit B',
        foodCategory: 'Veg',
        foodType: 'Bakery',
        quantity: 30,
        unit: 'packets',
        packaging: 'Biodegradable Craft Boxes',
        allergens: ['dairy', 'gluten', 'egg'],
        storage: 'Room temp',
        photoUrl: '',
        preparedAt: new Date(now - hour * 2).toISOString(),
        expiresAt: new Date(now + hour * 4.5).toISOString(),
        pickupStart: new Date(now).toISOString(),
        pickupEnd: new Date(now + hour * 3).toISOString(),
        recurring: false,
        consent: true,
        status: 'claimed',
        assignedCourierId: 'CR-101',
        ngoId: 'NGO-301',
        ngoName: 'Hope Community Kitchen',
        createdAt: new Date(now - hour * 2).toISOString(),
        distanceKm: 2.4
      },
      {
        id: 'FB-2026-0043',
        title: '75 Portions Grilled Chicken Salad & Fruit Cups',
        donorType: 'Hotel / Restaurant',
        donorName: 'Grand Horizon Hotel',
        contactPerson: 'Marco Silva',
        phone: '+1 (555) 088-3412',
        email: 'events@grandhorizon.com',
        address: '880 Ocean Boulevard',
        landmark: 'Ballroom Loading Dock 4',
        foodCategory: 'Non-veg',
        foodType: 'Cooked',
        quantity: 75,
        unit: 'servings',
        packaging: 'Sealed Thermo Containers',
        allergens: ['dairy'],
        storage: 'Cold',
        photoUrl: '',
        preparedAt: new Date(now - hour * 1).toISOString(),
        expiresAt: new Date(now + hour * 1.2).toISOString(),
        pickupStart: new Date(now).toISOString(),
        pickupEnd: new Date(now + hour * 1).toISOString(),
        recurring: false,
        consent: true,
        status: 'in_transit',
        assignedCourierId: 'CR-102',
        ngoId: 'NGO-302',
        ngoName: 'St. Jude Youth Shelter',
        createdAt: new Date(now - hour * 1).toISOString(),
        distanceKm: 3.8
      },
      {
        id: 'FB-2026-0044',
        title: '100 Packets Organic Whole Wheat Bread & Buns',
        donorType: 'Event / Caterer',
        donorName: 'Sunrise Banquet Logistics',
        contactPerson: 'David Chen',
        phone: '+1 (555) 077-1122',
        email: 'david@sunrisecaterers.org',
        address: '120 Park Plaza Center',
        landmark: 'Main Exhibition Hall',
        foodCategory: 'Vegan',
        foodType: 'Packaged',
        quantity: 100,
        unit: 'packets',
        packaging: 'Factory Sealed Plastic Wraps',
        allergens: ['gluten'],
        storage: 'Room temp',
        photoUrl: '',
        preparedAt: new Date(now - hour * 5).toISOString(),
        expiresAt: new Date(now + hour * 12).toISOString(),
        pickupStart: new Date(now).toISOString(),
        pickupEnd: new Date(now + hour * 8).toISOString(),
        recurring: false,
        consent: true,
        status: 'available',
        assignedCourierId: null,
        ngoId: null,
        ngoName: null,
        createdAt: new Date(now - hour * 5).toISOString(),
        distanceKm: 0.8
      },
      {
        id: 'FB-2026-0045',
        title: '40 kg Fresh Farm Apples & Seasonal Oranges',
        donorType: 'Household / Market',
        donorName: 'Community Garden Co-op',
        contactPerson: 'Sarah Jenkins',
        phone: '+1 (555) 033-8844',
        email: 'sarah@coopgardens.org',
        address: '77 Maple Avenue',
        landmark: 'Greenhouse Office 1',
        foodCategory: 'Vegan',
        foodType: 'Raw produce',
        quantity: 40,
        unit: 'kg',
        packaging: 'Wooden Crates',
        allergens: [],
        storage: 'Room temp',
        photoUrl: '',
        preparedAt: new Date(now - hour * 10).toISOString(),
        expiresAt: new Date(now + hour * 48).toISOString(),
        pickupStart: new Date(now).toISOString(),
        pickupEnd: new Date(now + hour * 24).toISOString(),
        recurring: true,
        consent: true,
        status: 'delivered',
        assignedCourierId: 'CR-101',
        ngoId: 'NGO-301',
        ngoName: 'Hope Community Kitchen',
        createdAt: new Date(now - hour * 10).toISOString(),
        distanceKm: 1.5
      }
    ];

    const seedCouriers = [
      {
        id: 'CR-101',
        name: 'Alex Rivera',
        phone: '+1 (555) 012-9844',
        vehicle: 'Bicycle',
        capacity: 35,
        insulatedBag: true,
        serviceArea: '90210 (Downtown & Campus District)',
        availability: 'Mon-Fri 2 PM - 8 PM',
        availableNow: true,
        completedDeliveries: 42,
        mealsDelivered: 840,
        onTimeRate: 98,
        badges: ['First Rescue', 'Speedy Courier', 'Eco Hero'],
        activeDeliveryId: null
      },
      {
        id: 'CR-102',
        name: 'Jordan Taylor',
        phone: '+1 (555) 019-3321',
        vehicle: 'Scooter',
        capacity: 60,
        insulatedBag: true,
        serviceArea: '90212 (North & Central Area)',
        availability: 'Daily 10 AM - 10 PM',
        availableNow: true,
        completedDeliveries: 78,
        mealsDelivered: 1560,
        onTimeRate: 99,
        badges: ['Top Courier 2026', 'Night Owl', 'Zero Waste Champion'],
        activeDeliveryId: 'FB-2026-0043'
      },
      {
        id: 'CR-103',
        name: 'Priya Sharma',
        phone: '+1 (555) 017-4490',
        vehicle: 'Van',
        capacity: 250,
        insulatedBag: true,
        serviceArea: '90215 (Greater Metro & Suburbs)',
        availability: 'Sat-Sun All Day',
        availableNow: false,
        completedDeliveries: 31,
        mealsDelivered: 1240,
        onTimeRate: 96,
        badges: ['Heavy Hauler', 'Weekend Warrior'],
        activeDeliveryId: null
      }
    ];

    const seedNGOs = [
      {
        id: 'NGO-301',
        name: 'Hope Community Kitchen',
        type: 'Community kitchen',
        regNo: 'NGO-USA-88412-B',
        address: '104 River Street, District 4',
        contactName: 'Sister Maria',
        phone: '+1 (555) 018-7722',
        peopleServedDaily: 150,
        schedule: 'Daily 8:00 AM - 9:00 PM (24/7 Hotline)',
        maxMealsPerDay: 300,
        acceptedFoodTypes: ['Veg', 'Cooked', 'Packaged', 'Bakery'],
        coldStorage: true,
        acceptingDeliveries: true,
        emergencyContact: '+1 (555) 099-0011',
        verified: true
      },
      {
        id: 'NGO-302',
        name: 'St. Jude Youth Shelter',
        type: 'Orphanage / Youth Home',
        regNo: 'NGO-USA-99102-A',
        address: '550 Pine Road',
        contactName: 'Pastor Marcus',
        phone: '+1 (555) 011-4433',
        peopleServedDaily: 80,
        schedule: 'Mon-Sun 7:00 AM - 8:00 PM',
        maxMealsPerDay: 120,
        acceptedFoodTypes: ['Veg', 'Non-veg', 'Cooked', 'Packaged'],
        coldStorage: true,
        acceptingDeliveries: true,
        emergencyContact: '+1 (555) 011-4434',
        verified: true
      },
      {
        id: 'NGO-303',
        name: 'Grace Senior Care House',
        type: 'Old-age home',
        regNo: 'NGO-USA-77319-C',
        address: '88 Oak Lane',
        contactName: 'Dr. Aris Thorne',
        phone: '+1 (555) 044-6622',
        peopleServedDaily: 60,
        schedule: 'Daily 9:00 AM - 6:00 PM',
        maxMealsPerDay: 90,
        acceptedFoodTypes: ['Veg', 'Cooked', 'Bakery'],
        coldStorage: false,
        acceptingDeliveries: true,
        emergencyContact: '+1 (555) 044-6623',
        verified: true
      }
    ];

    const seedNeeds = [
      {
        id: 'ND-501',
        ngoId: 'NGO-301',
        ngoName: 'Hope Community Kitchen',
        title: 'Warm Evening Meals needed for 60 Dinner Guests',
        quantity: 60,
        deadline: new Date(now + hour * 3).toISOString(),
        priority: 'Urgent',
        status: 'open'
      },
      {
        id: 'ND-502',
        ngoId: 'NGO-302',
        ngoName: 'St. Jude Youth Shelter',
        title: 'Fresh Bakery / Snacks for Children After-School Program',
        quantity: 40,
        deadline: new Date(now + hour * 5).toISOString(),
        priority: 'High',
        status: 'open'
      }
    ];

    setItem(STORAGE_KEYS.LISTINGS, seedListings);
    setItem(STORAGE_KEYS.COURIERS, seedCouriers);
    setItem(STORAGE_KEYS.NGOS, seedNGOs);
    setItem(STORAGE_KEYS.NEEDS, seedNeeds);
  }

  /* --------------------------------------------------------------------------
     3. PUBLIC API METHOD ENGINE
     -------------------------------------------------------------------------- */
  const AppEngine = {
    // Initialization
    init() {
      seedInitialData();
      this.bindGlobalEvents();
      this.highlightCurrentNav();
      this.renderMiniDiagram();
    },

    // Data Accessors
    getListings(filter = {}) {
      let data = getItem(STORAGE_KEYS.LISTINGS, []);
      if (filter.status) data = data.filter(item => item.status === filter.status);
      if (filter.category) data = data.filter(item => item.foodCategory === filter.category);
      if (filter.urgency === 'urgent') {
        const hour = 3600 * 1000;
        const now = Date.now();
        data = data.filter(item => new Date(item.expiresAt).getTime() - now <= hour * 2);
      }
      return data;
    },

    addListing(formData) {
      const listings = getItem(STORAGE_KEYS.LISTINGS, []);
      const newId = `FB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date().toISOString();

      const newListing = {
        id: newId,
        title: formData.title || 'Surplus Food Donation',
        donorType: formData.donorType || 'Household',
        donorName: formData.donorName || 'Anonymous Donor',
        contactPerson: formData.contactPerson || 'Contact',
        phone: formData.phone || '+1 555-0000',
        email: formData.email || 'donor@foodbridge.org',
        address: formData.address || 'Local City Center',
        landmark: formData.landmark || '',
        foodCategory: formData.foodCategory || 'Veg',
        foodType: formData.foodType || 'Cooked',
        quantity: Number(formData.quantity) || 20,
        unit: formData.unit || 'servings',
        packaging: formData.packaging || 'Standard Container',
        allergens: formData.allergens || [],
        storage: formData.storage || 'Room temp',
        photoUrl: formData.photoUrl || '',
        preparedAt: formData.preparedAt || now,
        expiresAt: formData.expiresAt || new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
        pickupStart: formData.pickupStart || now,
        pickupEnd: formData.pickupEnd || new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
        recurring: Boolean(formData.recurring),
        consent: Boolean(formData.consent),
        status: 'available',
        assignedCourierId: null,
        ngoId: null,
        ngoName: null,
        createdAt: now,
        distanceKm: Math.round((0.5 + Math.random() * 3.5) * 10) / 10
      };

      listings.unshift(newListing);
      setItem(STORAGE_KEYS.LISTINGS, listings);
      this.showToast(`Listing ${newId} posted successfully! Alert sent to couriers.`, 'success');
      return newListing;
    },

    updateListingStatus(id, newStatus, extraData = {}) {
      const listings = getItem(STORAGE_KEYS.LISTINGS, []);
      const idx = listings.findIndex(l => l.id === id);
      if (idx !== -1) {
        listings[idx].status = newStatus;
        if (extraData.assignedCourierId) listings[idx].assignedCourierId = extraData.assignedCourierId;
        if (extraData.ngoId) listings[idx].ngoId = extraData.ngoId;
        if (extraData.ngoName) listings[idx].ngoName = extraData.ngoName;
        setItem(STORAGE_KEYS.LISTINGS, listings);
        this.showToast(`Listing ${id} status updated to ${newStatus.replace('_', ' ').toUpperCase()}`, 'info');
      }
    },

    cancelListing(id) {
      this.updateListingStatus(id, 'expired', { cancelled: true });
      this.showToast(`Listing ${id} cancelled.`, 'warning');
    },

    // Courier Methods
    getCouriers() {
      return getItem(STORAGE_KEYS.COURIERS, []);
    },

    addCourier(courierData) {
      const couriers = getItem(STORAGE_KEYS.COURIERS, []);
      const newId = `CR-${Math.floor(100 + Math.random() * 900)}`;
      const newCourier = {
        id: newId,
        name: courierData.name || 'Courier Volunteer',
        phone: courierData.phone || '+1 555-0000',
        vehicle: courierData.vehicle || 'Bicycle',
        capacity: Number(courierData.capacity) || 30,
        insulatedBag: Boolean(courierData.insulatedBag),
        serviceArea: courierData.serviceArea || 'Citywide',
        availability: courierData.availability || 'Weekdays',
        availableNow: true,
        completedDeliveries: 0,
        mealsDelivered: 0,
        onTimeRate: 100,
        badges: ['New Volunteer'],
        activeDeliveryId: null
      };
      couriers.unshift(newCourier);
      setItem(STORAGE_KEYS.COURIERS, couriers);
      this.showToast(`Welcome ${newCourier.name}! Registered as Courier ${newId}`, 'success');
      return newCourier;
    },

    // NGO Methods
    getNGOs() {
      return getItem(STORAGE_KEYS.NGOS, []);
    },

    registerNGO(ngoData) {
      const ngos = getItem(STORAGE_KEYS.NGOS, []);
      const newId = `NGO-${Math.floor(300 + Math.random() * 900)}`;
      const newNGO = {
        id: newId,
        name: ngoData.name || 'Community Shelter Hub',
        type: ngoData.type || 'Community Center',
        regNo: ngoData.regNo || `REG-${Date.now()}`,
        address: ngoData.address || 'Main Street Hub',
        contactName: ngoData.contactName || 'Staff Contact',
        phone: ngoData.phone || '+1 555-0000',
        peopleServedDaily: Number(ngoData.peopleServedDaily) || 100,
        schedule: ngoData.schedule || 'Daily 9 AM - 8 PM',
        maxMealsPerDay: Number(ngoData.maxMealsPerDay) || 200,
        acceptedFoodTypes: ngoData.acceptedFoodTypes || ['Veg', 'Cooked'],
        coldStorage: Boolean(ngoData.coldStorage),
        acceptingDeliveries: true,
        emergencyContact: ngoData.emergencyContact || '',
        verified: true
      };
      ngos.unshift(newNGO);
      setItem(STORAGE_KEYS.NGOS, ngos);
      this.showToast(`NGO ${newNGO.name} registered and verified!`, 'success');
      return newNGO;
    },

    // Needs Methods
    getNeeds() {
      return getItem(STORAGE_KEYS.NEEDS, []);
    },

    postNeed(needData) {
      const needs = getItem(STORAGE_KEYS.NEEDS, []);
      const newId = `ND-${Math.floor(500 + Math.random() * 900)}`;
      const newNeed = {
        id: newId,
        ngoId: needData.ngoId || 'NGO-301',
        ngoName: needData.ngoName || 'Hope Community Kitchen',
        title: needData.title || 'Fresh Meals Needed',
        quantity: Number(needData.quantity) || 50,
        deadline: needData.deadline || new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
        priority: needData.priority || 'Urgent',
        status: 'open'
      };
      needs.unshift(newNeed);
      setItem(STORAGE_KEYS.NEEDS, needs);
      this.showToast(`Food Need posted: ${newNeed.title}`, 'info');
      return newNeed;
    },

    // Expiry Countdown Ring Math
    calculateExpiryRing(expiresAtIso) {
      const now = Date.now();
      const expires = new Date(expiresAtIso).getTime();
      const diffMs = expires - now;

      if (diffMs <= 0) {
        return { isExpired: true, text: 'EXPIRED', color: '#E4572E', percent: 0, dashOffset: 157 };
      }

      const totalWindow = 4 * 3600 * 1000; // 4 hours baseline
      const ratio = Math.min(1, Math.max(0, diffMs / totalWindow));
      const hours = Math.floor(diffMs / (3600 * 1000));
      const mins = Math.floor((diffMs % (3600 * 1000)) / (60 * 1000));

      let color = '#2E7D4F'; // Green
      if (ratio < 0.25 || hours === 0) color = '#E4572E'; // Red
      else if (ratio < 0.5) color = '#F6A623'; // Amber

      const circumference = 157; // 2 * pi * r (2 * 3.14159 * 25)
      const dashOffset = Math.round(circumference * (1 - ratio));

      const text = hours > 0 ? `${hours}h ${mins}m` : `${mins}m left`;
      return { isExpired: false, text, color, percent: Math.round(ratio * 100), dashOffset };
    },

    // Status Badge Markup Helper
    getStatusBadgeHtml(status) {
      const s = (status || 'available').toLowerCase();
      switch (s) {
        case 'available': return `<span class="status-badge badge-available">● Available</span>`;
        case 'claimed': return `<span class="status-badge badge-claimed">● Claimed by NGO</span>`;
        case 'courier_assigned': return `<span class="status-badge badge-courier">● Courier Assigned</span>`;
        case 'picked_up': return `<span class="status-badge badge-courier">● Picked Up</span>`;
        case 'in_transit': return `<span class="status-badge badge-transit">● In Transit</span>`;
        case 'delivered': return `<span class="status-badge badge-delivered">✓ Delivered</span>`;
        default: return `<span class="status-badge badge-expired">● Expired / Cancelled</span>`;
      }
    },

    // Toast Notification Floating Banner System
    showToast(message, type = 'info') {
      let container = document.getElementById('fb-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'fb-toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'error' ? '🚨' : 'ℹ️';
      toast.innerHTML = `
        <span style="font-size:1.2rem;">${icon}</span>
        <div style="font-weight:700; font-size:0.88rem; color:var(--text-dark);">${message}</div>
      `;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }, 4500);
    },

    // Reset Demo Data
    resetDemoData() {
      try {
        localStorage.removeItem(STORAGE_KEYS.LISTINGS);
        localStorage.removeItem(STORAGE_KEYS.COURIERS);
        localStorage.removeItem(STORAGE_KEYS.NGOS);
        localStorage.removeItem(STORAGE_KEYS.NEEDS);
        localStorage.removeItem(STORAGE_KEYS.DELIVERIES);
      } catch (_e) {}
      seedInitialData();
      this.showToast('Demo data reset to default seed state!', 'success');
      setTimeout(() => window.location.reload(), 800);
    },

    // Navigation & UI Helpers
    bindGlobalEvents() {
      // Theme Toggle
      const themeBtn = document.getElementById('theme-toggle');
      if (themeBtn) {
        themeBtn.addEventListener('click', () => {
          const current = document.documentElement.getAttribute('data-theme');
          const next = current === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', next);
          const icon = document.getElementById('theme-icon');
          if (icon) icon.innerText = next === 'dark' ? '☀️' : '🌙';
        });
      }

      // Mobile Navbar Toggle
      const mobileBtn = document.getElementById('mobile-menu-toggle');
      const navLinks = document.getElementById('nav-links');
      if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
          navLinks.classList.toggle('active');
        });
      }
    },

    highlightCurrentNav() {
      const path = window.location.pathname.split('/').pop() || 'index.html';
      document.querySelectorAll('.nav-link, .nav-dropdown-item').forEach(el => {
        const href = el.getAttribute('href');
        if (href && href.includes(path)) {
          el.setAttribute('aria-current', 'page');
        } else {
          el.removeAttribute('aria-current');
        }
      });
    },

    renderMiniDiagram() {
      const container = document.getElementById('rescue-chain-diagram');
      if (!container) return;
      
      const path = window.location.pathname.split('/').pop() || 'index.html';
      const isDonor = path.includes('donate');
      const isCourier = path.includes('courier');
      const isNGO = path.includes('ngo');

      container.innerHTML = `
        <div class="rescue-chain-banner" aria-label="Rescue Chain Workflow Step">
          <span style="font-size:0.8rem; font-weight:800; color:var(--text-muted); margin-right:0.5rem;">RESCUE CHAIN:</span>
          <span class="chain-step ${isDonor ? 'active' : ''}">👨‍🍳 1. Donor</span>
          <span class="chain-arrow">➔</span>
          <span class="chain-step ${isCourier ? 'active' : ''}">🚴 2. Courier</span>
          <span class="chain-arrow">➔</span>
          <span class="chain-step ${isNGO ? 'active' : ''}">🏢 3. NGO Shelter</span>
        </div>
      `;
    }
  };

  // Expose Globally
  window.FoodBridgeApp = AppEngine;

  // Auto Init
  document.addEventListener('DOMContentLoaded', () => {
    AppEngine.init();
  });

})();
