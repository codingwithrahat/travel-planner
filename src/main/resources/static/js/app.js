/**
 * TRAVEL PLANNER - Client Interactive Script
 * Handles real-time search, status filtering, dynamic form builders (itinerary & expenses),
 * budget tracking calculations, and quick-view modals.
 */

document.addEventListener('DOMContentLoaded', function () {
  initDashboardFilters();
  initFormDynamicLists();
  initQuickViewModal();
  initDeleteConfirmations();
});

/* ==========================================================================
   1. DASHBOARD SEARCH & STATUS FILTERING
   ========================================================================== */
function initDashboardFilters() {
  const searchInput = document.getElementById('tripSearchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const tripCards = document.querySelectorAll('.trip-card[data-status]');
  const emptyState = document.getElementById('emptyFilterState');
  const visibleCountBadge = document.getElementById('visibleTripsCount');

  if (!tripCards.length) return;

  let currentFilter = 'ALL';
  let currentSearch = '';

  function applyFilters() {
    let visibleCount = 0;

    tripCards.forEach(card => {
      const cardStatus = (card.getAttribute('data-status') || '').toUpperCase();
      const cardText = (card.textContent || '').toLowerCase();

      const matchesStatus = currentFilter === 'ALL' || cardStatus === currentFilter;
      const matchesSearch = !currentSearch || cardText.includes(currentSearch);

      if (matchesStatus && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (visibleCountBadge) {
      visibleCountBadge.textContent = visibleCount;
    }

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'flex' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      currentSearch = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = (btn.getAttribute('data-filter') || 'ALL').toUpperCase();
      applyFilters();
    });
  });
}

/* ==========================================================================
   2. DYNAMIC BUILDERS: ITINERARY & EXPENSES IN TRIP FORM
   ========================================================================== */
function initFormDynamicLists() {
  const itineraryContainer = document.getElementById('itineraryList');
  const addItineraryBtn = document.getElementById('addItineraryBtn');

  const expenseContainer = document.getElementById('expensesList');
  const addExpenseBtn = document.getElementById('addExpenseBtn');

  const budgetInput = document.getElementById('budget');
  const totalExpenseDisplay = document.getElementById('totalExpenseCalc');
  const remainingBudgetDisplay = document.getElementById('remainingBudgetCalc');

  // Recalculate expense summary
  function recalculateExpenses() {
    if (!expenseContainer) return;
    const amountInputs = expenseContainer.querySelectorAll('input[type="number"][name*="amount"]');
    let total = 0;
    amountInputs.forEach(input => {
      const val = parseFloat(input.value);
      if (!isNaN(val) && val > 0) {
        total += val;
      }
    });

    if (totalExpenseDisplay) {
      totalExpenseDisplay.textContent = '$' + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    if (budgetInput && remainingBudgetDisplay) {
      const budgetVal = parseFloat(budgetInput.value) || 0;
      const remaining = budgetVal - total;
      remainingBudgetDisplay.textContent = '$' + remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (remaining < 0) {
        remainingBudgetDisplay.style.color = '#dc2626';
      } else {
        remainingBudgetDisplay.style.color = 'var(--c-deep-900)';
      }
    }
  }

  // Bind calculation to budget input
  if (budgetInput) {
    budgetInput.addEventListener('input', recalculateExpenses);
  }

  // --- Itinerary Handlers ---
  function reindexItinerary() {
    if (!itineraryContainer) return;
    const rows = itineraryContainer.querySelectorAll('.itinerary-row');
    rows.forEach((row, idx) => {
      const badge = row.querySelector('.row-index-pill');
      if (badge) badge.textContent = 'Stop #' + (idx + 1);

      row.querySelectorAll('input, select, textarea').forEach(input => {
        const name = input.getAttribute('name');
        if (name) {
          input.setAttribute('name', name.replace(/itinerary\[\d+\]/, `itinerary[${idx}]`));
        }
      });
    });
  }

  if (addItineraryBtn && itineraryContainer) {
    addItineraryBtn.addEventListener('click', function () {
      const count = itineraryContainer.querySelectorAll('.itinerary-row').length;
      const dayVal = count + 1;

      const rowHtml = `
        <div class="dynamic-item-row itinerary-row" data-index="${count}">
          <div class="dynamic-row-header">
            <span class="row-index-pill">Stop #${count + 1}</span>
            <button type="button" class="btn-remove-row remove-itinerary-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Remove
            </button>
          </div>
          <div class="form-grid-3">
            <div class="form-group" style="margin-bottom:0.75rem;">
              <label class="form-label">Day Number <span class="required">*</span></label>
              <input type="number" name="itinerary[${count}].day" value="${dayVal}" min="1" class="form-control" required placeholder="e.g. 1" />
            </div>
            <div class="form-group" style="margin-bottom:0.75rem;">
              <label class="form-label">Time <span class="required">*</span></label>
              <input type="text" name="itinerary[${count}].time" class="form-control" required placeholder="e.g. 09:30 AM" />
            </div>
            <div class="form-group" style="margin-bottom:0.75rem;">
              <label class="form-label">Place / Attraction <span class="required">*</span></label>
              <input type="text" name="itinerary[${count}].place" class="form-control" required placeholder="e.g. Eiffel Tower, Paris" />
            </div>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">Notes & Activities</label>
            <input type="text" name="itinerary[${count}].note" class="form-control" placeholder="e.g. Guided summit tour, pre-booked tickets" />
          </div>
        </div>
      `;
      itineraryContainer.insertAdjacentHTML('beforeend', rowHtml);
    });

    itineraryContainer.addEventListener('click', function (e) {
      const btn = e.target.closest('.remove-itinerary-btn');
      if (btn) {
        const row = btn.closest('.itinerary-row');
        if (row) {
          row.remove();
          reindexItinerary();
        }
      }
    });
  }

  // --- Expenses Handlers ---
  function reindexExpenses() {
    if (!expenseContainer) return;
    const rows = expenseContainer.querySelectorAll('.expense-row');
    rows.forEach((row, idx) => {
      const badge = row.querySelector('.row-index-pill');
      if (badge) badge.textContent = 'Expense #' + (idx + 1);

      row.querySelectorAll('input, select, textarea').forEach(input => {
        const name = input.getAttribute('name');
        if (name) {
          input.setAttribute('name', name.replace(/expenses\[\d+\]/, `expenses[${idx}]`));
        }
      });
    });
    recalculateExpenses();
  }

  if (addExpenseBtn && expenseContainer) {
    addExpenseBtn.addEventListener('click', function () {
      const count = expenseContainer.querySelectorAll('.expense-row').length;

      const rowHtml = `
        <div class="dynamic-item-row expense-row" data-index="${count}">
          <div class="dynamic-row-header">
            <span class="row-index-pill">Expense #${count + 1}</span>
            <button type="button" class="btn-remove-row remove-expense-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Remove
            </button>
          </div>
          <div class="form-grid-3">
            <div class="form-group" style="margin-bottom:0.75rem;">
              <label class="form-label">Category</label>
              <select name="expenses[${count}].category" class="form-control">
                <option value="Flight">✈️ Flight / Transit</option>
                <option value="Hotel">🏨 Hotel / Stay</option>
                <option value="Food">🍽️ Food & Dining</option>
                <option value="Sightseeing">🎟️ Sightseeing / Tours</option>
                <option value="Shopping">🛍️ Shopping</option>
                <option value="Misc">📦 Miscellaneous</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom:0.75rem;">
              <label class="form-label">Amount ($) <span class="required">*</span></label>
              <input type="number" step="0.01" min="0" name="expenses[${count}].amount" class="form-control expense-amount-input" required placeholder="0.00" />
            </div>
            <div class="form-group" style="margin-bottom:0.75rem;">
              <label class="form-label">Description</label>
              <input type="text" name="expenses[${count}].description" class="form-control" placeholder="e.g. Airport taxi or Museum pass" />
            </div>
          </div>
        </div>
      `;
      expenseContainer.insertAdjacentHTML('beforeend', rowHtml);
      const newAmountInput = expenseContainer.querySelector(`input[name="expenses[${count}].amount"]`);
      if (newAmountInput) {
        newAmountInput.addEventListener('input', recalculateExpenses);
      }
    });

    expenseContainer.addEventListener('click', function (e) {
      const btn = e.target.closest('.remove-expense-btn');
      if (btn) {
        const row = btn.closest('.expense-row');
        if (row) {
          row.remove();
          reindexExpenses();
        }
      }
    });

    // Attach listener to any initial amounts
    expenseContainer.querySelectorAll('.expense-amount-input').forEach(input => {
      input.addEventListener('input', recalculateExpenses);
    });

    // Run initial calc
    recalculateExpenses();
  }
}

/* ==========================================================================
   3. QUICK-VIEW MODAL FOR DASHBOARD
   ========================================================================== */
function initQuickViewModal() {
  const modalOverlay = document.getElementById('tripQuickModal');
  const modalCloseBtn = document.getElementById('closeModalBtn');
  const modalFooterCloseBtn = document.getElementById('modalFooterCloseBtn');
  const modalDetailLink = document.getElementById('modalFullDetailLink');

  if (!modalOverlay) return;

  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalFooterCloseBtn) modalFooterCloseBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Attach quick view triggers from cards
  document.querySelectorAll('.btn-quick-view').forEach(btn => {
    btn.addEventListener('click', function () {
      const tripId = btn.getAttribute('data-id');
      const tripTitle = btn.getAttribute('data-title') || 'Trip Details';
      const tripDest = btn.getAttribute('data-destination') || '';
      const tripDates = btn.getAttribute('data-dates') || '';
      const tripBudget = btn.getAttribute('data-budget') || '0';
      const tripStatus = btn.getAttribute('data-status') || '';
      const tripTransport = btn.getAttribute('data-transport') || '';

      document.getElementById('modalTripTitle').textContent = tripTitle;
      document.getElementById('modalTripDest').textContent = tripDest;
      document.getElementById('modalTripDates').textContent = tripDates;
      document.getElementById('modalTripBudget').textContent = '$' + Number(tripBudget).toLocaleString();
      document.getElementById('modalTripTransport').textContent = tripTransport;

      const statusBadge = document.getElementById('modalTripStatus');
      if (statusBadge) {
        statusBadge.textContent = tripStatus;
        statusBadge.className = 'status-badge status-' + tripStatus.toLowerCase();
      }

      if (modalDetailLink) {
        modalDetailLink.href = '/travel-planner/' + tripId;
      }

      modalOverlay.classList.add('active');
    });
  });
}

/* ==========================================================================
   4. DELETE CONFIRMATION
   ========================================================================== */
function initDeleteConfirmations() {
  document.querySelectorAll('form[action*="/delete/"]').forEach(form => {
    form.addEventListener('submit', function (e) {
      const confirmed = confirm('Are you sure you want to delete this travel plan? This action cannot be undone.');
      if (!confirmed) {
        e.preventDefault();
      }
    });
  });
}
