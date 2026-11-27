import { saveInquiry } from './supabase.js';

(() => {
  const parts = [
    { id:'engine-block', name:'Engine block', category:'Engine', type:'Engine internal', description:'The structural core of an engine, with cylinder bores and mounting points that must match the exact engine code.', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Chevrolet_small-block_engine_-_Automobile_Driving_Museum_-_El_Segundo%2C_CA_-_DSC01736.jpg/960px-Chevrolet_small-block_engine_-_Automobile_Driving_Museum_-_El_Segundo%2C_CA_-_DSC01736.jpg', alt:'Small-block automotive engine display', source:'https://commons.wikimedia.org/wiki/File:Chevrolet_small-block_engine_-_Automobile_Driving_Museum_-_El_Segundo,_CA_-_DSC01736.jpg', credit:'Wikimedia Commons' },
    { id:'cylinder-head', name:'Cylinder head', category:'Engine', type:'Engine internal', description:'Closes the cylinder bores and houses valve-train components; configuration depends on the engine.', image:'https://images.pexels.com/photos/33559354/pexels-photo-33559354/free-photo-of-mechanic-handling-engine-cylinder-head-assembly.jpeg?auto=compress&w=1200', alt:'Mechanic handling an engine cylinder head assembly', source:'https://www.pexels.com/photo/mechanic-handling-engine-cylinder-head-assembly-33559354/', credit:'Pexels' },
    { id:'alternator', name:'Alternator', category:'Electrical & lighting', type:'Electrical', description:'Generates electrical power for the vehicle and charges its battery in conventional charging systems.', image:'assets/parts/alternator.png', alt:'Automotive alternator', source:'', credit:'' },
    { id:'starter-motor', name:'Starter motor', category:'Electrical & lighting', type:'Electrical', description:'Turns the engine during starting; mounting, voltage and electrical connections are vehicle-specific.', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Automobile_starter.JPG/960px-Automobile_starter.JPG', alt:'Automotive starter motor', source:'https://commons.wikimedia.org/wiki/File:Automobile_starter.JPG', credit:'Wikimedia Commons' },
    { id:'radiator', name:'Radiator', category:'Cooling & HVAC', type:'Cooling', description:'Transfers heat from engine coolant to airflow; dimensions and hose connections vary by vehicle.', image:'https://images.pexels.com/photos/34351909/pexels-photo-34351909/free-photo-of-close-up-of-car-radiator-and-front-bumper-detail.jpeg?cs=tinysrgb&dpr=1&w=1200', alt:'Close-up of a vehicle radiator', source:'https://www.pexels.com/photo/close-up-of-car-radiator-and-front-bumper-detail-34351909/', credit:'Pexels' },
    { id:'fuel-pump', name:'Fuel pump', category:'Fuel & ignition', type:'Fuel system', description:'Moves fuel from the tank to the engine at the pressure required by its fuel system.', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6a/Brandstofinspuitpomp.JPG/960px-Brandstofinspuitpomp.JPG', alt:'Diesel fuel injection pump', source:'https://commons.wikimedia.org/wiki/File:Brandstofinspuitpomp.JPG', credit:'Wikimedia Commons' },
    { id:'oil-filter', name:'Oil filter', category:'Engine', type:'Filtration', description:'Removes contaminants from engine oil; filter type and bypass specification are engine-specific.', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Engine_oil_filter.JPG/960px-Engine_oil_filter.JPG', alt:'Engine oil filter', source:'https://commons.wikimedia.org/wiki/File:Engine_oil_filter.JPG', credit:'Wikimedia Commons' },
    { id:'air-filter', name:'Air filter', category:'Engine', type:'Filtration', description:'Filters intake air before it reaches the engine; shape and filtration specification vary by application.', image:'https://images.pexels.com/photos/9381003/pexels-photo-9381003.jpeg?cs=tinysrgb&dpr=1&w=1200', alt:'Air filter being fitted in a car', source:'https://www.pexels.com/photo/a-person-putting-air-filter-in-the-car-9381003/', credit:'Pexels' },
    { id:'spark-plugs', name:'Spark plugs', category:'Fuel & ignition', type:'Ignition', description:'Ignite the air-fuel mixture in spark-ignition engines; thread, heat range and gap must match the engine.', image:'assets/parts/spark-plugs.png', alt:'Automotive spark plug', source:'', credit:'' },
    { id:'timing-belt', name:'Timing belt', category:'Engine', type:'Engine internal', description:'Synchronizes crankshaft and camshaft rotation on engines designed for belt-driven timing.', image:'', alt:'Automotive timing belt reference', source:'', credit:'' },
    { id:'turbocharger', name:'Turbocharger', category:'Engine', type:'Induction', description:'Uses exhaust energy to increase intake-air pressure; sizing and control must match the engine system.', image:'https://images.pexels.com/photos/7565170/pexels-photo-7565170.jpeg?cs=tinysrgb&dpr=1&w=1200', alt:'Turbocharger assembly being handled by a mechanic', source:'https://www.pexels.com/photo/close-up-shot-of-a-person-holding-a-turbo-thread-7565170/', credit:'Pexels' },
    { id:'gearbox-transmission', name:'Gearbox / Transmission', category:'Transmission & drivetrain', type:'Transmission', description:'Transfers engine output to the driven wheels; transmission type, ratios and control systems are vehicle-specific.', image:'https://images.pexels.com/photos/29181492/pexels-photo-29181492/free-photo-of-mechanic-working-on-car-transmission-in-workshop.jpeg?cs=tinysrgb&dpr=1&w=1200', alt:'Mechanic working on a car transmission', source:'https://www.pexels.com/photo/mechanic-working-on-car-transmission-in-workshop-29181492/', credit:'Pexels' },
    { id:'clutch-kit', name:'Clutch kit', category:'Transmission & drivetrain', type:'Clutch', description:'A matched clutch assembly for vehicles with a compatible manual-transmission setup; component contents vary.', image:'https://upload.wikimedia.org/wikipedia/commons/6/6f/Multi-spring_plate_clutch_%28Manual_of_Driving_and_Maintenance%29.jpg', alt:'Multi-spring clutch assembly', source:'https://commons.wikimedia.org/wiki/File:Multi-spring_plate_clutch_(Manual_of_Driving_and_Maintenance).jpg', credit:'Wikimedia Commons' },
    { id:'brake-pads', name:'Brake pads', category:'Brakes', type:'Braking', description:'Friction material that clamps against the brake disc; pad shape and compound depend on the braking system.', image:'assets/parts/brake-discs.png', alt:'Brake disc and brake assembly', source:'', credit:'' },
    { id:'brake-discs', name:'Brake discs', category:'Brakes', type:'Braking', description:'Rotating friction surfaces used with brake pads; diameter, thickness and design are application-specific.', image:'assets/parts/brake-discs.png', alt:'Automotive brake disc and red brake caliper', source:'', credit:'' },
    { id:'shock-absorbers', name:'Shock absorbers', category:'Suspension & steering', type:'Suspension', description:'Dampen suspension movement to control spring oscillation; fitment depends on vehicle, axle and suspension setup.', image:'assets/parts/shock-absorbers.png', alt:'Automotive shock absorbers and coil springs', source:'', credit:'' },
    { id:'front-bumpers', name:'Front bumpers', category:'Body & exterior', type:'Body parts', description:'Front bumper and grille assemblies protect and finish the vehicle front; mounting points and trim vary by make and model.', image:'assets/parts/front-bumpers.png', alt:'Vehicle front bumpers and grilles displayed in a parts showroom', source:'', credit:'' },
    { id:'tyres', name:'Tyres', category:'Wheels & tyres', type:'Tyres', description:'Road tyres provide traction and support vehicle load; size, load index and speed rating must match the vehicle and wheel.', image:'assets/parts/tyres.png', alt:'Stack of automotive tyres', source:'', credit:'' },
    { id:'steering-rack', name:'Steering rack', category:'Suspension & steering', type:'Steering', description:'Converts steering input into lateral movement at the steering linkage in rack-and-pinion systems.', image:'https://upload.wikimedia.org/wikipedia/commons/f/f5/Car_with_clearly_visible_steering_rack_with_inner_track_rod_and_track_rod_ends.jpg', alt:'Steering rack and track rods visible beneath a car', source:'https://commons.wikimedia.org/wiki/File:Car_with_clearly_visible_steering_rack_with_inner_track_rod_and_track_rod_ends.jpg', credit:'Wikimedia Commons' },
    { id:'wheel-bearings', name:'Wheel bearings', category:'Suspension & steering', type:'Suspension', description:'Support wheel rotation and vehicle loads; hub, bearing and sensor integration differ across vehicles.', image:'', alt:'Automotive wheel bearing reference', source:'', credit:'' },
    { id:'car-battery', name:'Car battery', category:'Electrical & lighting', type:'Electrical', description:'A 12-volt battery commonly supplies starting and accessory power; high-voltage traction batteries are different systems.', image:'https://images.pexels.com/photos/37177070/pexels-photo-37177070/free-photo-of-close-up-of-car-battery-in-engine-bay.jpeg?auto=compress&w=1200', alt:'Car battery in an engine bay', source:'https://www.pexels.com/photo/close-up-of-car-battery-in-engine-bay-37177070/', credit:'Pexels' },
    { id:'headlights', name:'Headlights', category:'Electrical & lighting', type:'Lighting', description:'Front lighting assemblies provide road illumination; lamp technology, connectors and housings vary by trim.', image:'https://images.pexels.com/photos/27993136/pexels-photo-27993136/free-photo-of-bmw-e30.jpeg?auto=compress&w=1200', alt:'Close-up of a BMW headlight assembly', source:'https://www.pexels.com/photo/bmw-e30-27993136/', credit:'Pexels' },
    { id:'oxygen-sensor', name:'Oxygen sensor', category:'Fuel & ignition', type:'Emissions', description:'Measures oxygen in exhaust gases to support engine control and emissions monitoring; connector and application vary.', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/New_oxygen_sensor_%284145545072%29.jpg/960px-New_oxygen_sensor_%284145545072%29.jpg', alt:'New automotive oxygen sensor', source:'https://commons.wikimedia.org/wiki/File:New_oxygen_sensor_(4145545072).jpg', credit:'Wikimedia Commons' },
  ];

  const pageSize = parts.length;
  const grid = document.querySelector('#parts-grid');
  const search = document.querySelector('#parts-search');
  const brandFilter = document.querySelector('#parts-brand-filter');
  const modelFilter = document.querySelector('#parts-model-filter');
  const categoryFilter = document.querySelector('#parts-category-filter');
  const typeFilter = document.querySelector('#parts-type-filter');
  const resultCount = document.querySelector('#parts-result-count');
  const loadMore = document.querySelector('#parts-load-more');
  const dialog = document.querySelector('#parts-enquiry-dialog');
  const enquiryForm = document.querySelector('#parts-enquiry-form');
  const enquiryDescription = document.querySelector('#parts-enquiry-description');
  const enquiryStatus = document.querySelector('#parts-form-status');
  const enquirySubmit = document.querySelector('#parts-form-submit');
  let visibleCount = pageSize;
  let selectedPart = null;

  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  })[character]);

  const filteredParts = () => {
    const query = search.value.trim().toLowerCase();
    const brand = brandFilter.value;
    const model = modelFilter.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const type = typeFilter.value;
    return parts.filter(part => {
      const searchable = [part.name, part.category, part.type, part.description].join(' ').toLowerCase();
      const brands = part.compatibleBrands || [];
      const models = part.compatibleModels || [];
      return (!query || searchable.includes(query)) &&
        (brand === 'all' || brands.includes(brand)) &&
        (!model || models.some(item => item.toLowerCase().includes(model))) &&
        (category === 'all' || part.category === category) &&
        (type === 'all' || part.type === type);
    });
  };

  const renderParts = reset => {
    if (reset) visibleCount = pageSize;
    const matches = filteredParts();
    const shown = matches.slice(0, visibleCount);
    const hasVehicleFilter = brandFilter.value !== 'all' || modelFilter.value.trim();
    grid.innerHTML = shown.length ? shown.map(part => `
      <article class="part-card">
        ${part.image ? `<figure class="part-photo"><img src="${escapeHtml(part.image)}" alt="${escapeHtml(part.alt)}" loading="lazy" decoding="async"></figure>` : ''}
        <div class="part-copy">
          <div class="part-meta"><span class="part-category">${escapeHtml(part.category)}</span><span class="part-availability">AVAILABILITY UNCONFIRMED</span></div>
          <h3>${escapeHtml(part.name)}</h3>
          <p>${escapeHtml(part.description)}</p>
          <div class="part-fitment"><strong>Compatible vehicles</strong>Not verified yet. Enquire with your make, model and year.</div>
          ${part.source ? `<span class="part-credit">Image: <a href="${escapeHtml(part.source)}" target="_blank" rel="noopener noreferrer">${escapeHtml(part.credit)}</a></span>` : ''}
          <button class="part-enquire" type="button" data-part-id="${escapeHtml(part.id)}"><span>ENQUIRE ABOUT THIS PART</span><span aria-hidden="true">&nearr;</span></button>
        </div>
      </article>`).join('') : `<div class="parts-empty"><strong>No parts match that search.</strong>${hasVehicleFilter ? 'No confirmed fitment records match this vehicle. Enquire so we can check.' : 'Try a different name or clear one of the filters.'}</div>`;
    resultCount.textContent = matches.length ? `Showing ${shown.length} of ${matches.length} parts` : 'No matching parts';
    loadMore.hidden = matches.length <= visibleCount;
  };

  const openEnquiry = part => {
    selectedPart = part;
    enquiryDescription.textContent = `${part.name} — availability and exact fitment must be confirmed for your vehicle.`;
    document.querySelector('#parts-enquiry-message').value = `Please check fitment and availability for the ${part.name}.`;
    dialog.showModal();
    document.querySelector('#parts-customer-name').focus();
  };

  search.addEventListener('input', () => renderParts(true));
  modelFilter.addEventListener('input', () => renderParts(true));
  brandFilter.addEventListener('change', () => renderParts(true));
  categoryFilter.addEventListener('change', () => renderParts(true));
  typeFilter.addEventListener('change', () => renderParts(true));
  loadMore.addEventListener('click', () => {
    visibleCount += pageSize;
    renderParts(false);
  });
  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-part-id]');
    if (!button) return;
    const part = parts.find(item => item.id === button.dataset.partId);
    if (part) openEnquiry(part);
  });
  grid.addEventListener('error', event => {
    if (event.target.tagName !== 'IMG') return;
    event.target.closest('.part-photo').remove();
  }, true);
  document.querySelector('#parts-dialog-close').addEventListener('click', () => dialog.close());
  document.querySelector('#parts-dialog-cancel').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    enquiryForm.reset();
    enquirySubmit.disabled = false;
    enquiryStatus.textContent = '';
    enquiryStatus.removeAttribute('data-error');
    selectedPart = null;
  });
  enquiryForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!selectedPart || !enquiryForm.reportValidity()) return;
    const name = document.querySelector('#parts-customer-name').value.trim();
    const phone = document.querySelector('#parts-customer-phone').value.trim();
    const email = document.querySelector('#parts-customer-email').value.trim();
    const make = document.querySelector('#parts-vehicle-make').value;
    const model = document.querySelector('#parts-vehicle-model').value.trim();
    const message = document.querySelector('#parts-enquiry-message').value;
    const details = [
      `Part requested: ${selectedPart.name}`,
      `Vehicle make: ${make}`,
      `Vehicle model/year/VIN: ${model}`,
      `Customer message: ${message}`,
      'Please confirm fitment and availability before order.'
    ].join('\n');
    enquirySubmit.disabled = true;
    enquiryStatus.removeAttribute('data-error');
    enquiryStatus.textContent = 'Saving your parts enquiry…';
    try {
      const { error } = await saveInquiry({
        full_name: name,
        phone,
        email,
        message: details,
        enquiry_type: 'parts'
      });
      if (error) throw error;
      enquiryStatus.textContent = 'Thank you. Your parts enquiry has been saved for the Eddyson Autos team.';
    } catch (error) {
      enquiryStatus.setAttribute('data-error', 'true');
      enquiryStatus.textContent = `Unable to save your parts enquiry: ${error.message}`;
      enquirySubmit.disabled = false;
    }
  });

  renderParts(true);
})();
