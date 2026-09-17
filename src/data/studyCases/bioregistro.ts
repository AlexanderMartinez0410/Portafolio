import type { StudyCase } from '../../types';

export const bioregistroEs: StudyCase = {
  id: 'bioregistro',
  title: 'BIOREGISTRO // Sistema Móvil de Control Biométrico y Anti-Fraude',
  vaultPath: '01_PROJECTS/2025_Bioregistro_Mobile_AntiFraude.md',
  frontmatter: {
    type: 'Case Study / Mobile Security & Biometrics',
    role: 'Único Desarrollador (Solo Engineer & Mobile Lead)',
    status: '#production // #active',
    created: '2025-02-10',
    tags: ['#flutter', '#mobile-security', '#anti-fraud', '#biometrics', '#geofencing', '#firebase', '#segundo-cerebro'],
    technologies: ['Flutter SDK', 'Dart', 'Firebase Firestore', 'Firebase Auth', 'Local Auth', 'OpenStreetMap'],
    methodologies: ['Feature-First Architecture', 'Triple Barrera Anti-Fraude', 'Geocercas Haversine', 'Single-Device Lock (UUID)', 'SLA de Emergencia (5 Días)'],
    stack: ['Flutter SDK', 'Dart', 'Firebase Firestore', 'Firebase Auth', 'Local Auth', 'Geolocator (Haversine)', 'Device Info Plus'],
    complexity: 'Alta (Seguridad Móvil + SLA de Emergencia 5 Días)',
    impact: '0 incidencias de fraude y despliegue a producción en 5 días calendario'
  },
  contextAndProblem:
    'Fricción continua y disputas por retrasos docentes en entornos educativos donde la infraestructura de hardware dedicado (relojes biométricos de pared) resultaba prohibitiva en costos o era fácilmente vulnerada mediante suplantación de identidad entre colegas.',
  architectureDecision: {
    adrSummary: 'ADR-002: Feature-First Architecture en Flutter + Triple Barrera Anti-Fraude Inmutable',
    diagramAscii: `
+-------------------------------------------------------------------+
|                        FLUTTER MOBILE CLIENT                      |
|      [ Feature-First Modular Structure: admin, docente, auth ]    |
+----------------------------------+--------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                     TRIPLE BARRERA ANTI-FRAUDE                    |
|   1. [ Local Auth ]      ──> Huella Dactilar / Face ID Obligatorio|
|   2. [ Haversine GPS ]   ──> Geocerca Perimetral Precisión Métrica|
|   3. [ Single-Device Lock] ─> UUID Hardware Inmutable (device_info)|
+----------------------------------+--------------------------------+
                                  | Transacción Atómica
                                  v
+-------------------------------------------------------------------+
|                     FIREBASE CLOUD INFRASTRUCTURE                 |
|   - [ Firestore ]    ──> Transacciones en tiempo real             |
|   - [ Auth ]         ──> Aprovisionamiento atómico (SecondaryApp) |
|   - [ Cloud Storage] ──> Evidencias de justificaciones y permisos |
+-------------------------------------------------------------------+`,
    keyPoints: [
      'Triple barrera de seguridad: biometría nativa obligatoria, cálculo de geocerca perimetral Haversine y bloqueo por UUID físico del dispositivo.',
      'Mapeo dinámico sobre OpenStreetMap (flutter_map) eliminando costos recurrentes de licencias privativas de mapas.',
      'Aprovisionamiento aislado de usuarios administrativos mediante instancia secundaria de Firebase Auth (SecondaryApp).',
      'Desarrollo en solitario de extremo a extremo, testing y despliegue completado bajo SLA de emergencia en 5 días calendario.'
    ]
  },
  technicalSolution: {
    overview:
      'Se diseñó un pipeline de validación en Flutter que ejecuta concurrentemente la verificación biométrica del hardware y la validación matemática de proximidad GPS antes de emitir la transacción a Firestore.',
    snippets: [
      {
        filename: 'biometric_validator_service.dart',
        language: 'dart',
        code: `class BiometricAttendanceValidator {
  final LocalAuthentication _localAuth;
  final GeofenceService _geofenceService;
  final DeviceIdentityService _deviceService;

  BiometricAttendanceValidator(this._localAuth, this._geofenceService, this._deviceService);

  Future<ValidationResult> validateAndPunch({
    required String teacherId,
    required GeoPoint campusCoords,
    required double allowedRadiusMeters,
  }) async {
    // 1. Barrera 1: Validación de UUID de Dispositivo Físico
    final deviceUuid = await _deviceService.getImmutableDeviceUuid();
    final isAuthorizedDevice = await _deviceService.verifyDeviceBound(teacherId, deviceUuid);
    if (!isAuthorizedDevice) {
      return ValidationResult.failure("Dispositivo no autorizado. Contacte a Dirección.");
    }

    // 2. Barrera 2: Geocerca Haversine
    final isWithinCampus = await _geofenceService.isWithinRadius(campusCoords, allowedRadiusMeters);
    if (!isWithinCampus) {
      return ValidationResult.failure("Ubicación fuera del perímetro institucional permitido.");
    }

    // 3. Barrera 3: Biometría Nativa (Huella / Face ID)
    final authenticated = await _localAuth.authenticate(
      localizedReason: 'Confirme su identidad biométrica para registrar asistencia',
      options: const AuthenticationOptions(biometricOnly: true, stickyAuth: true),
    );

    if (!authenticated) {
      return ValidationResult.failure("Fallo en la autenticación biométrica.");
    }

    return ValidationResult.success(deviceUuid);
  }
}`
      }
    ]
  },
  challengesAndFixes: [
    {
      challenge: 'SLA de emergencia: diseño de arquitectura, codificación, pruebas y despliegue funcional en producción en 5 días calendario.',
      solution: 'Adopción de Feature-First Architecture con componentes reutilizables, Firebase Serverless y testing enfocado en los 3 vectores de seguridad.'
    },
    {
      challenge: 'Riesgo de fraude mediante aplicaciones de ubicación simulada (Mock GPS / Fake Location).',
      solution: 'Integración de detección a bajo nivel de flags de mock location en Geolocator y validación cruzada con saltos de tiempo en Firestore.'
    }
  ],
  resultsAndSecondBrainLinks: {
    metrics: [
      { label: 'Tiempo de Entrega', value: '5 días calendario a producción' },
      { label: 'Suplantación de Identidad', value: '0 incidencias reportadas' },
      { label: 'Gasto en Hardware (CapEx)', value: '$0 dólares (dispositivos existentes)' }
    ],
    backlinks: [
      '[[Flutter-Feature-First-Architecture]]',
      '[[Mobile-Security-AntiFraud]]',
      '[[Haversine-Geofencing-Algorithms]]',
      '[[Firebase-Enterprise-Patterns]]'
    ],
    conclusion:
      'Bioregistro resolvió la disputa de horarios en tiempo récord sin requerir inversión en costosos relojes biométricos, garantizando un 100% de certeza en la identidad docente.'
  },
  callouts: [
    {
      type: 'tip',
      title: 'Decisión de Costos Cero',
      content: 'El cálculo matemático perimetral con la fórmula de Haversine sobre OpenStreetMap evitó facturaciones de APIs de Google Maps en miles de marcaciones mensuales.'
    }
  ]
};

export const bioregistroEn: StudyCase = {
  id: 'bioregistro',
  title: 'BIOREGISTRO // Mobile Biometric Attendance & Anti-Fraud System',
  vaultPath: '01_PROJECTS/2025_Bioregistro_Mobile_AntiFraude.md',
  frontmatter: {
    type: 'Case Study / Mobile Security & Biometrics',
    role: 'Sole Software Engineer & Mobile Lead',
    status: '#production // #active',
    created: '2025-02-10',
    tags: ['#flutter', '#mobile-security', '#anti-fraud', '#biometrics', '#geofencing', '#firebase', '#second-brain'],
    technologies: ['Flutter SDK', 'Dart', 'Firebase Firestore', 'Firebase Auth', 'Local Auth', 'OpenStreetMap'],
    methodologies: ['Feature-First Architecture', 'Triple Anti-Fraud Barrier', 'Haversine Geofencing', 'Single-Device Lock (UUID)', 'Emergency 5-Day SLA'],
    stack: ['Flutter SDK', 'Dart', 'Firebase Firestore', 'Firebase Auth', 'Local Auth', 'Geolocator (Haversine)', 'Device Info Plus'],
    complexity: 'High (Mobile Security + 5-Day Emergency SLA)',
    impact: '0 fraud incidents and production rollout within a 5-calendar-day SLA'
  },
  contextAndProblem:
    'Persistent disputes over faculty attendance where dedicated wall-mounted biometric clocks were cost-prohibitive or prone to identity proxying between colleagues.',
  architectureDecision: {
    adrSummary: 'ADR-002: Feature-First Architecture in Flutter + Immutable Triple Anti-Fraud Barrier',
    diagramAscii: `
+-------------------------------------------------------------------+
|                        FLUTTER MOBILE CLIENT                      |
|      [ Feature-First Modular Structure: admin, docente, auth ]    |
+----------------------------------+--------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                     TRIPLE ANTI-FRAUD BARRIER                     |
|   1. [ Local Auth ]      ──> Mandatory Native Fingerprint / FaceID|
|   2. [ Haversine GPS ]   ──> Metric Precision Perimeter Geofence  |
|   3. [ Single-Device Lock] ─> Immutable Hardware UUID (device_info)|
+----------------------------------+--------------------------------+
                                  | Atomic Transaction
                                  v
+-------------------------------------------------------------------+
|                     FIREBASE CLOUD INFRASTRUCTURE                 |
|   - [ Firestore ]    ──> Real-time ACID transactions              |
|   - [ Auth ]         ──> Atomic Provisioning (SecondaryApp)       |
|   - [ Cloud Storage] ──> Digital Justification Attachments        |
+-------------------------------------------------------------------+`,
    keyPoints: [
      'Triple security barrier: mandatory native biometrics, Haversine perimeter calculation, and immutable hardware UUID locking.',
      'Dynamic rendering on OpenStreetMap (flutter_map) avoiding recurring Google Maps API billing.',
      'Isolated admin user provisioning using Firebase Auth secondary app instance (SecondaryApp).',
      'End-to-end solo engineering, testing, and production rollout executed within a 5-day emergency SLA.'
    ]
  },
  technicalSolution: {
    overview:
      'Engineered a validation pipeline in Flutter that concurrently checks hardware biometric auth and GPS mathematical proximity prior to committing attendance transactions to Firestore.',
    snippets: [
      {
        filename: 'biometric_validator_service.dart',
        language: 'dart',
        code: `class BiometricAttendanceValidator {
  final LocalAuthentication _localAuth;
  final GeofenceService _geofenceService;
  final DeviceIdentityService _deviceService;

  BiometricAttendanceValidator(this._localAuth, this._geofenceService, this._deviceService);

  Future<ValidationResult> validateAndPunch({
    required String teacherId,
    required GeoPoint campusCoords,
    required double allowedRadiusMeters,
  }) async {
    // 1. Barrier 1: Immutable Hardware Device UUID
    final deviceUuid = await _deviceService.getImmutableDeviceUuid();
    final isAuthorizedDevice = await _deviceService.verifyDeviceBound(teacherId, deviceUuid);
    if (!isAuthorizedDevice) {
      return ValidationResult.failure("Unauthorized device. Contact administration.");
    }

    // 2. Barrier 2: Haversine Geofence
    final isWithinCampus = await _geofenceService.isWithinRadius(campusCoords, allowedRadiusMeters);
    if (!isWithinCampus) {
      return ValidationResult.failure("Location outside allowable campus perimeter.");
    }

    // 3. Barrier 3: Native Biometrics (Fingerprint / Face ID)
    final authenticated = await _localAuth.authenticate(
      localizedReason: 'Confirm biometric identity to record attendance',
      options: const AuthenticationOptions(biometricOnly: true, stickyAuth: true),
    );

    if (!authenticated) {
      return ValidationResult.failure("Biometric authentication failed.");
    }

    return ValidationResult.success(deviceUuid);
  }
}`
      }
    ]
  },
  challengesAndFixes: [
    {
      challenge: '5-Day Emergency SLA: deliver architecture, coding, testing, and production deployment in 5 calendar days.',
      solution: 'Implemented Feature-First architecture with reusable modules, Firebase serverless backends, and targeted security vector testing.'
    },
    {
      challenge: 'Fraud risks through Mock GPS and fake location spoofing apps.',
      solution: 'Low-level mock location flag inspection in Geolocator coupled with Firestore server-side timestamp delta verification.'
    }
  ],
  resultsAndSecondBrainLinks: {
    metrics: [
      { label: 'Delivery Time', value: '5 calendar days to production' },
      { label: 'Identity Spoofing', value: '0 reported incidents' },
      { label: 'Hardware CapEx', value: '$0 spent (BYOD)' }
    ],
    backlinks: [
      '[[Flutter-Feature-First-Architecture]]',
      '[[Mobile-Security-AntiFraud]]',
      '[[Haversine-Geofencing-Algorithms]]',
      '[[Firebase-Enterprise-Patterns]]'
    ],
    conclusion:
      'Bioregistro resolved faculty attendance disputes in record time without expensive physical clocks, ensuring 100% identity confidence.'
  },
  callouts: [
    {
      type: 'tip',
      title: 'Zero CapEx Strategy',
      content: 'Haversine distance math on OpenStreetMap completely eliminated Google Maps recurring API billing on thousands of monthly punches.'
    }
  ]
};
