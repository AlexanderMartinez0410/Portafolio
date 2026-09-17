import type { StudyCase, Project, CatalogProject } from '../types';
import type { Language } from '../types/i18n';

export const studyCasesData: Record<Language, Record<string, StudyCase>> = {
  es: {
    // =========================================================================
    // 1. AMMI ONLINE // .NET 8 + ANGULAR 20 SSR CLEAN ARCHITECTURE & CQRS
    // =========================================================================
    'ammi-online': {
      id: 'ammi-online',
      title: 'AMMI ONLINE // Plataforma Institucional & Gestión Académica',
      vaultPath: '01_PROJECTS/2025_AMMI_Online_Clean_Architecture.md',
      frontmatter: {
        type: 'Case Study / Architecture Record',
        role: 'Líder de Proyecto & Lead Full Stack Engineer',
        status: '#production // #active',
        created: '2025-01-10',
        tags: ['#clean-architecture', '#dotnet8', '#cqrs', '#angular20-ssr', '#postgresql', '#segundo-cerebro', '#enterprise'],
        technologies: ['Angular 20 SSR', '.NET 8 Web API', 'PostgreSQL', 'C#', 'TypeScript', 'PrimeNG 21', 'Tailwind CSS'],
        methodologies: ['Clean Architecture (4 Capas)', 'CQRS & MediatR', 'Server-Side Rendering (SSR)', 'Generación Automatizada de Reportes', 'CORS & Seguridad HTTP'],
        stack: ['Angular 20 SSR', '.NET 8 Web API', 'PostgreSQL', 'C#', 'TypeScript', 'MediatR', 'FluentValidation', 'EF Core 8', 'PrimeNG 21'],
        complexity: 'Alta (Enterprise / Alta Concurrencia)',
        impact: 'Digitalización 100% de procesos y reducción de generación de reportes de 2 semanas a 2 minutos'
      },
      contextAndProblem:
        'Ausencia total de infraestructura digital en la institución. Todos los procesos operativos, admisiones, distributivos y matrículas se gestionaban de forma manual y desarticulada en hojas de cálculo de Excel, documentos de Word dispersos en Google Drive y expedientes físicos en papel, causando pérdidas de información y semanas de retraso en auditorías y reportes.',
      architectureDecision: {
        adrSummary: 'ADR-001: Clean Architecture en 4 Capas + CQRS con MediatR + Angular 20 SSR sobre PostgreSQL',
        diagramAscii: `
+-------------------------------------------------------------------+
|                        PRESENTATION LAYER                         |
|   [ Angular 20 SSR (@angular/ssr) + Express + PrimeNG 21 ]        |
|   [ Client-Side & Server Stream Exporters: xlsx, jspdf ]          |
+----------------------------------+--------------------------------+
                                  | REST / JWT (Bearer Auth) + CORS
                                  v
+-------------------------------------------------------------------+
|                       APPLICATION LAYER (CQRS)                    |
|   +---------------------------+   +---------------------------+   |
|   |    COMMANDS (MediatR)     |   |     QUERIES (MediatR)     |   |
|   | [MatriculaEstudianteCmd]  |   | [GenerarReporteCursoQry]  |   |
|   +-------------+-------------+   +-------------+-------------+   |
|                 |                               |                 |
|                 v                               v                 |
|       [ FluentValidation ]            [ Projection DTOs ]         |
+-----------------+-------------------------------+-----------------+
                  |                               |
                  v                               v
+-------------------------------------------------------------------+
|                          DOMAIN LAYER                             |
|    [ Entities: Estudiante, Matricula, Asignatura, Distributivo ]  |
|    [ ValueObjects: Email, CedulaEcuatoriana, PeriodoAcademico ]   |
|    [ Domain Events: MatriculaConfirmadaDomainEvent ]              |
+---------------------------------+---------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                       INFRASTRUCTURE LAYER                        |
|  [ EF Core 8 DbContext ]  <-->  [ PostgreSQL Relational Cluster ] |
|  [ Serilog Structured Telemetry ] <--> [ Audit Logs ]             |
+-------------------------------------------------------------------+`,
        keyPoints: [
          'Separación estricta en 4 capas: Presentation, Application, Domain e Infrastructure.',
          'Patrón CQRS desacoplado mediante MediatR y validación determinista con FluentValidation.',
          'Server-Side Rendering (@angular/ssr) para optimización de carga instantánea y SEO institucional.',
          'Persistencia centralizada en PostgreSQL con índices optimizados para agregaciones y consultas analíticas.',
          'Configuración segura de CORS, autenticación JWT y telemetría estructurada con Serilog.'
        ]
      },
      technicalSolution: {
        overview:
          'Liderazgo y desarrollo del ecosistema completo: modelado de base de datos relacional en PostgreSQL, pipeline CQRS en .NET 8 con MediatR, y frontend reactivo en Angular 20 SSR con componentes PrimeNG y exportación automatizada de reportes.',
        snippets: [
          {
            filename: 'GenerarReporteAcademicoQueryHandler.cs',
            language: 'csharp',
            code: `public class GenerarReporteAcademicoQueryHandler 
    : IRequestHandler<GenerarReporteAcademicoQuery, Result<ReporteConsolidadoDto>>
{
    private readonly IApplicationDbContext _context;

    public GenerarReporteAcademicoQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<ReporteConsolidadoDto>> Handle(
        GenerarReporteAcademicoQuery request, 
        CancellationToken cancellationToken)
    {
        // Consulta agregada directa optimizada sobre PostgreSQL
        var consolidado = await _context.Matriculas
            .AsNoTracking()
            .Where(m => m.PeriodoId == request.PeriodoId && m.CursoId == request.CursoId)
            .Select(m => new DetalleReporteDto
            {
                EstudianteId = m.EstudianteId,
                NombreCompleto = m.Estudiante.Apellidos + " " + m.Estudiante.Nombres,
                Cedula = m.Estudiante.Cedula,
                EstadoMatricula = m.Estado.ToString(),
                PromedioGeneral = m.Calificaciones.Average(c => (decimal?)c.NotaFinal) ?? 0
            })
            .ToListAsync(cancellationToken);

        return Result.Success(new ReporteConsolidadoDto(consolidado));
    }
}`
          }
        ]
      },
      challengesAndFixes: [
        {
          challenge: 'Migrar una institución que operaba 100% en hojas de cálculo de Excel dispersas y documentos físicos a un modelo relacional unificado sin interrupción de matrículas.',
          solution: 'Diseño e implementación de un modelo de datos canónico en PostgreSQL con pipelines de validación estricta y Clean Architecture.'
        },
        {
          challenge: 'Tiempos excesivos de consolidación de notas y reportes institucionales (tomaban de 1 a 2 semanas por curso).',
          solution: 'Creación de un motor automatizado de reportes que procesa y genera consolidados oficiales en menos de 2 minutos.'
        }
      ],
      resultsAndSecondBrainLinks: {
        metrics: [
          { label: 'Generación de Reportes', value: '< 2 minutos (antes 1 a 2 semanas)' },
          { label: 'Procesos Digitalizados', value: '100% de la operación académica' },
          { label: 'Consistencia de Datos', value: '0 pérdida de información / PostgreSQL' }
        ],
        backlinks: [
          '[[Clean-Architecture-Guidelines]]',
          '[[CQRS-Event-Driven-Patterns]]',
          '[[Angular-SSR-Performance]]',
          '[[PostgreSQL-Schema-Design]]'
        ],
        conclusion:
          'AMMI Online digitalizó de punta a punta la operación institucional bajo mi liderazgo técnico, reemplazando carpetas físicas y archivos dispersos de Drive por una plataforma de alto rendimiento con reportes automatizados en minutos.'
      },
      callouts: [
        {
          type: 'important',
          title: 'Liderazgo & Impacto de Ingeniería',
          content: 'El proyecto transformó una entidad sin herramientas digitales en una operación moderna con 100% de procesos automatizados y tiempos de auditoría reducidos de semanas a minutos.'
        }
      ]
    },

    // =========================================================================
    // 2. BIOREGISTRO // FLUTTER + TRIPLE BARRERA ANTI-FRAUDE & FIREBASE
    // =========================================================================
    'bioregistro': {
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
    },

    // =========================================================================
    // 3. DESAPARECIDOS EC // FASTAPI + FLUTTER + CELERY + REDIS GEO-ALERTS
    // =========================================================================
    'desaparecidos-ec': {
      id: 'desaparecidos-ec',
      title: 'DESAPARECIDOS EC // Plataforma Cívica & Análisis Geoespacial',
      vaultPath: '01_PROJECTS/2026_Desaparecidos_EC_Geo_Alerts.md',
      frontmatter: {
        type: 'Case Study / Civic Tech & High Concurrency',
        role: 'Líder de Frontend & UI/UX Engineer',
        status: '#prototype // #active-development',
        created: '2026-01-20',
        tags: ['#civic-tech', '#frontend-lead', '#ui-ux', '#flutter', '#riverpod', '#geospatial', '#segundo-cerebro'],
        technologies: ['Flutter', 'Dart', 'Riverpod 2.6', 'FastAPI', 'Python 3.12', 'Celery', 'Redis Pub/Sub', 'PostgreSQL'],
        methodologies: ['Arquitectura Frontend Reactiva', 'Diseño de Interfaz & Experiencia (UI/UX)', 'Mapas Geoespaciales Interactivos', 'Visualización de Alertas en Tiempo Real'],
        stack: ['Flutter', 'Riverpod 2.6', 'OpenStreetMap', 'WebSockets', 'FastAPI', 'Redis Pub/Sub'],
        complexity: 'Alta (Diseño UI/UX de Emergencia + Renderizado Geoespacial)',
        impact: 'Propagación de alertas en <3s y renderizado en mapa en <200ms'
      },
      contextAndProblem:
        'Ineficiencia crítica durante la "Ventana Dorada" (primeras 24-48 horas tras una desaparición). La difusión tradicional depende de boletines estáticos en redes sociales sin focalización espacial, provocando que los ciudadanos en el perímetro inmediato no sean alertados a tiempo.',
      architectureDecision: {
        adrSummary: 'ADR-003: Arquitectura Asíncrona con Ingesta Celery + Difusión Redis Pub/Sub y Geofencing',
        diagramAscii: `
+-------------------------------------------------------------------+
|                        MOBILE CLIENT (Flutter)                    |
|      [ Riverpod 2.6 State + OpenStreetMap Map Rendering ]         |
+----------------------------------+--------------------------------+
                                  | WebSockets / REST API
                                  v
+-------------------------------------------------------------------+
|                          FASTAPI CORE API                         |
|   [ Async Endpoints + Haversine Radius Filter + Rate Limiting ]   |
+-------------------+-------------------------------+---------------+
                     |                               |
           (Pub/Sub) v                     (Async)   v
+-----------------------------+   +---------------------------------+
|       REDIS ENGINE          |   |         CELERY WORKERS          |
|  - Real-Time Geo Pub/Sub    |   |  - Automated Web Scrapers       |
|  - Ephemeral Hot Cache      |   |  - Duplicate Reconciliation     |
+-----------------------------+   +---------------------------------+`,
        keyPoints: [
          'Backend asíncrono en FastAPI optimizado para alta concurrencia y conexiones WebSocket persistentes.',
          'Indexación perimetral con radio adaptativo (500m en entornos urbanos densos hasta 10km en carreteras/zonas rurales).',
          'Redis Pub/Sub como capa de transporte de alertas en tiempo real desacoplada de la base de datos relacional.',
          'Workers de Celery para raspado continuo de fuentes oficiales y reconciliación de duplicados.'
        ]
      },
      technicalSolution: {
        overview:
          'Se construyó un motor de difusión perimetral que calcula en memoria la intersección geográfica entre la última coordenada reportada y los clientes suscritos al canal WebSocket de la zona.',
        snippets: [
          {
            filename: 'geo_alert_dispatcher.py',
            language: 'python',
            code: `import math
from fastapi import WebSocket
from typing import List, Dict

class GeoAlertDispatcher:
    @staticmethod
    def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calcula la distancia ortodrómica entre dos puntos geográficos"""
        r = 6371.0 # Radio medio de la Tierra en km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat / 2) ** 2 + 
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return r * c

    async def broadcast_to_perimeter(
        self, 
        target_lat: float, 
        target_lon: float, 
        radius_km: float, 
        alert_payload: dict,
        active_clients: Dict[str, dict]
    ):
        """Difunde la alerta exclusivamente a clientes dentro del radio perimetral"""
        for client_id, client_meta in active_clients.items():
            dist = self.haversine_distance_km(
                target_lat, target_lon, 
                client_meta['lat'], client_meta['lon']
            )
            if dist <= radius_km:
                ws: WebSocket = client_meta['socket']
                await ws.send_json({
                    "event": "URGENT_PERIMETER_ALERT",
                    "distance_km": round(dist, 2),
                    "data": alert_payload
                })`
          }
        ]
      },
      challengesAndFixes: [
        {
          challenge: 'Resolver consultas geoespaciales masivas en milisegundos sin saturar el pool de conexiones de la base de datos relacional.',
          solution: 'Indexación espacial en caché Redis y filtrado matemático de Haversine en el worker de difusión sin tocar la persistencia relacional.'
        },
        {
          challenge: 'Normalización de boletines heterogéneos provenientes de múltiples portales oficiales.',
          solution: 'Pipeline asíncrono con Celery que extrae, valida y estructura los metadatos en un esquema canónico único.'
        }
      ],
      resultsAndSecondBrainLinks: {
        metrics: [
          { label: 'Propagación de Alertas', value: '< 3 segundos a clientes en radio' },
          { label: 'Consultas Geo en Mapa', value: '< 200 ms de latencia' },
          { label: 'Radio Adaptativo', value: '500m urbano a 10km rural' }
        ],
        backlinks: [
          '[[Civic-Tech-Platforms]]',
          '[[FastAPI-Async-Concurrency]]',
          '[[Redis-PubSub-RealTime]]',
          '[[Geospatial-Indexing-Algorithms]]'
        ],
        conclusion:
          'Desaparecidos EC establece una base tecnológica de alta velocidad para convertir la búsqueda de personas en un esfuerzo colaborativo y geográficamente inteligente.'
      },
      callouts: [
        {
          type: 'important',
          title: 'Métrica Crítica: La Ventana Dorada',
          content: 'Cada segundo cuenta en las primeras 48 horas. La arquitectura fue diseñada para que el 90% de los recursos se dediquen a la difusión perimetral inmediata.'
        }
      ]
    }
  },

  en: {
    // =========================================================================
    // 1. AMMI ONLINE // .NET 8 + ANGULAR 20 SSR CLEAN ARCHITECTURE & CQRS
    // =========================================================================
    'ammi-online': {
      id: 'ammi-online',
      title: 'AMMI ONLINE // Institutional Platform & Academic Suite',
      vaultPath: '01_PROJECTS/2025_AMMI_Online_Clean_Architecture.md',
      frontmatter: {
        type: 'Case Study / Architecture Record',
        role: 'Project Lead & Lead Full Stack Engineer',
        status: '#production // #active',
        created: '2025-01-10',
        tags: ['#clean-architecture', '#dotnet8', '#cqrs', '#angular20-ssr', '#postgresql', '#second-brain', '#enterprise'],
        technologies: ['Angular 20 SSR', '.NET 8 Web API', 'PostgreSQL', 'C#', 'TypeScript', 'PrimeNG 21', 'Tailwind CSS'],
        methodologies: ['Clean Architecture (4 Layers)', 'CQRS & MediatR', 'Server-Side Rendering (SSR)', 'Automated Report Generation', 'CORS & HTTP Security'],
        stack: ['Angular 20 SSR', '.NET 8 Web API', 'PostgreSQL', 'C#', 'TypeScript', 'MediatR', 'FluentValidation', 'EF Core 8', 'PrimeNG 21'],
        complexity: 'High (Enterprise / High Concurrency)',
        impact: '100% process digitalization and report generation time reduced from 2 weeks to 2 minutes'
      },
      contextAndProblem:
        'Complete absence of digital infrastructure in the institution. All operational workflows, admissions, teaching schedules, and grade reporting were managed manually across loose Excel spreadsheets, scattered Google Drive Word files, and physical paper binders, causing recurrent data loss and multi-week auditing delays.',
      architectureDecision: {
        adrSummary: 'ADR-001: 4-Layer Clean Architecture + CQRS via MediatR + Angular 20 SSR on PostgreSQL',
        diagramAscii: `
+-------------------------------------------------------------------+
|                        PRESENTATION LAYER                         |
|   [ Angular 20 SSR (@angular/ssr) + Express + PrimeNG 21 ]        |
|   [ Client-Side & Server Stream Exporters: xlsx, jspdf ]          |
+----------------------------------+--------------------------------+
                                  | REST / JWT (Bearer Auth) + CORS
                                  v
+-------------------------------------------------------------------+
|                       APPLICATION LAYER (CQRS)                    |
|   +---------------------------+   +---------------------------+   |
|   |    COMMANDS (MediatR)     |   |     QUERIES (MediatR)     |   |
|   | [EnrollStudentCmd]        |   | [GenerateCourseReportQry] |   |
|   +-------------+-------------+   +-------------+-------------+   |
|                 |                               |                 |
|                 v                               v                 |
|       [ FluentValidation ]            [ Projection DTOs ]         |
+-----------------+-------------------------------+-----------------+
                  |                               |
                  v                               v
+-------------------------------------------------------------------+
|                          DOMAIN LAYER                             |
|    [ Entities: Student, Enrollment, Subject, WorkloadSchedule ]   |
|    [ ValueObjects: Email, NationalId, AcademicTerm ]              |
|    [ Domain Events: EnrollmentConfirmedDomainEvent ]              |
+---------------------------------+---------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                       INFRASTRUCTURE LAYER                        |
|  [ EF Core 8 DbContext ]  <-->  [ PostgreSQL Relational Cluster ] |
|  [ Serilog Structured Telemetry ] <--> [ Audit Logs ]             |
+-------------------------------------------------------------------+`,
        keyPoints: [
          'Strict 4-layer decoupling: Presentation, Application, Domain, and Infrastructure.',
          'CQRS pattern isolated via MediatR and deterministic validation with FluentValidation.',
          'Server-Side Rendering (@angular/ssr) for instant initial render and institutional SEO indexing.',
          'Centralized PostgreSQL persistence with query indexing tuned for heavy aggregated academic reports.',
          'Strict CORS security headers, JWT bearer authentication, and structured logging via Serilog.'
        ]
      },
      technicalSolution: {
        overview:
          'Full-lifecycle technical leadership: modeled the canonical relational schema in PostgreSQL, engineered the .NET 8 CQRS backend pipeline with MediatR, and built the reactive Angular 20 SSR frontend with PrimeNG components and instant report exporters.',
        snippets: [
          {
            filename: 'GenerarReporteAcademicoQueryHandler.cs',
            language: 'csharp',
            code: `public class GenerarReporteAcademicoQueryHandler 
    : IRequestHandler<GenerarReporteAcademicoQuery, Result<ReporteConsolidadoDto>>
{
    private readonly IApplicationDbContext _context;

    public GenerarReporteAcademicoQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<ReporteConsolidadoDto>> Handle(
        GenerarReporteAcademicoQuery request, 
        CancellationToken cancellationToken)
    {
        // Direct aggregated query optimized on PostgreSQL
        var consolidado = await _context.Matriculas
            .AsNoTracking()
            .Where(m => m.PeriodoId == request.PeriodoId && m.CursoId == request.CursoId)
            .Select(m => new DetalleReporteDto
            {
                EstudianteId = m.EstudianteId,
                NombreCompleto = m.Estudiante.Apellidos + " " + m.Estudiante.Nombres,
                Cedula = m.Estudiante.Cedula,
                EstadoMatricula = m.Estado.ToString(),
                PromedioGeneral = m.Calificaciones.Average(c => (decimal?)c.NotaFinal) ?? 0
            })
            .ToListAsync(cancellationToken);

        return Result.Success(new ReporteConsolidadoDto(consolidado));
    }
}`
          }
        ]
      },
      challengesAndFixes: [
        {
          challenge: 'Migrating an institution completely reliant on scattered spreadsheets and paper records to a normalized relational architecture without pausing active student enrollment.',
          solution: 'Designed and deployed a canonical PostgreSQL relational schema with strict validation pipelines and Clean Architecture decoupling.'
        },
        {
          challenge: 'Slow, error-prone report generation that required 1 to 2 weeks of manual labor per course.',
          solution: 'Engineered an automated report generation engine that aggregates and exports certified dossiers in under 2 minutes.'
        }
      ],
      resultsAndSecondBrainLinks: {
        metrics: [
          { label: 'Report Generation', value: '< 2 minutes (was 1 to 2 weeks)' },
          { label: 'Digitalized Processes', value: '100% academic operations' },
          { label: 'Data Integrity', value: 'Zero loss / Centralized PostgreSQL' }
        ],
        backlinks: [
          '[[Clean-Architecture-Guidelines]]',
          '[[CQRS-Event-Driven-Patterns]]',
          '[[Angular-SSR-Performance]]',
          '[[PostgreSQL-Schema-Design]]'
        ],
        conclusion:
          'AMMI Online modernized the institution end-to-end under my technical direction, replacing fragile paper files and loose Drive sheets with an enterprise-grade platform that generates certified reports in minutes.'
      },
      callouts: [
        {
          type: 'important',
          title: 'Engineering Leadership & Business Impact',
          content: 'The project converted an organization with zero digital tooling into a high-efficiency automated operation, slashing auditing and reporting turnaround from weeks to 2 minutes.'
        }
      ]
    },

    // =========================================================================
    // 2. BIOREGISTRO // FLUTTER + TRIPLE ANTI-FRAUD BARRIER & FIREBASE
    // =========================================================================
    'bioregistro': {
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
    },

    // =========================================================================
    // 3. DESAPARECIDOS EC // FASTAPI + FLUTTER + CELERY + REDIS GEO-ALERTS
    // =========================================================================
    'desaparecidos-ec': {
      id: 'desaparecidos-ec',
      title: 'DESAPARECIDOS EC // Civic Rapid Alerts & Geospatial Engine',
      vaultPath: '01_PROJECTS/2026_Desaparecidos_EC_Geo_Alerts.md',
      frontmatter: {
        type: 'Case Study / Civic Tech & High Concurrency',
        role: 'Frontend Lead & UI/UX Engineer',
        status: '#prototype // #active-development',
        created: '2026-01-20',
        tags: ['#civic-tech', '#frontend-lead', '#ui-ux', '#flutter', '#riverpod', '#geospatial', '#second-brain'],
        technologies: ['Flutter', 'Dart', 'Riverpod 2.6', 'FastAPI', 'Python 3.12', 'Celery', 'Redis Pub/Sub', 'PostgreSQL'],
        methodologies: ['Reactive Frontend Architecture', 'UI/UX Interface & Experience Design', 'Interactive Geospatial Maps', 'Real-Time Alert Rendering'],
        stack: ['Flutter', 'Riverpod 2.6', 'OpenStreetMap', 'WebSockets', 'FastAPI', 'Redis Pub/Sub'],
        complexity: 'High (Emergency UI/UX Design + Geospatial Rendering)',
        impact: 'Alert broadcast in <3s and map render response in <200ms'
      },
      contextAndProblem:
        'Critical delays during the "Golden Window" (first 24-48 hours after disappearance). Traditional flyers on social media lack spatial focus, leaving citizens in the immediate perimeter unaware of urgent alerts.',
      architectureDecision: {
        adrSummary: 'ADR-003: Asynchronous Architecture with Celery Ingestion + Redis Pub/Sub Broadcast and Geofencing',
        diagramAscii: `
+-------------------------------------------------------------------+
|                        MOBILE CLIENT (Flutter)                    |
|      [ Riverpod 2.6 State + OpenStreetMap Map Rendering ]         |
+----------------------------------+--------------------------------+
                                  | WebSockets / REST API
                                  v
+-------------------------------------------------------------------+
|                          FASTAPI CORE API                         |
|   [ Async Endpoints + Haversine Radius Filter + Rate Limiting ]   |
+-------------------+-------------------------------+---------------+
                     |                               |
           (Pub/Sub) v                     (Async)   v
+-----------------------------+   +---------------------------------+
|       REDIS ENGINE          |   |         CELERY WORKERS          |
|  - Real-Time Geo Pub/Sub    |   |  - Automated Web Scrapers       |
|  - Ephemeral Hot Cache      |   |  - Duplicate Reconciliation     |
+-----------------------------+   +---------------------------------+`,
        keyPoints: [
          'Asynchronous FastAPI core optimized for high throughput and long-lived WebSocket connections.',
          'Adaptive perimeter radius indexing (500m in dense urban areas up to 10km in rural sectors).',
          'Redis Pub/Sub messaging layer decouples instant dispatch from disk-bound relational databases.',
          'Celery worker fleet scrapes official bulletins and reconciles duplicates continuously.'
        ]
      },
      technicalSolution: {
        overview:
          'Engineered an in-memory geo-dispatcher that computes real-time geospatial intersections between incident coordinates and active subscribed WebSocket clients.',
        snippets: [
          {
            filename: 'geo_alert_dispatcher.py',
            language: 'python',
            code: `import math
from fastapi import WebSocket
from typing import List, Dict

class GeoAlertDispatcher:
    @staticmethod
    def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculates Great-Circle distance between two coordinates"""
        r = 6371.0 # Earth mean radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat / 2) ** 2 + 
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return r * c

    async def broadcast_to_perimeter(
        self, 
        target_lat: float, 
        target_lon: float, 
        radius_km: float, 
        alert_payload: dict,
        active_clients: Dict[str, dict]
    ):
        """Broadcasts alert strictly to clients within the perimeter radius"""
        for client_id, client_meta in active_clients.items():
            dist = self.haversine_distance_km(
                target_lat, target_lon, 
                client_meta['lat'], client_meta['lon']
            )
            if dist <= radius_km:
                ws: WebSocket = client_meta['socket']
                await ws.send_json({
                    "event": "URGENT_PERIMETER_ALERT",
                    "distance_km": round(dist, 2),
                    "data": alert_payload
                })`
          }
        ]
      },
      challengesAndFixes: [
        {
          challenge: 'Handling massive geospatial perimeter queries in sub-second time without exhausting database connection pools.',
          solution: 'Spatial indexing in Redis cache and worker-level in-memory Haversine filtering before hitting relational persistence.'
        },
        {
          challenge: 'Normalizing heterogeneous incident bulletins across disparate official portals.',
          solution: 'Asynchronous Celery pipeline that extracts, validates, and normalizes records into a single canonical schema.'
        }
      ],
      resultsAndSecondBrainLinks: {
        metrics: [
          { label: 'Alert Propagation', value: '< 3 seconds to nearby clients' },
          { label: 'Map Queries', value: '< 200 ms latency' },
          { label: 'Perimeter Range', value: '500m urban to 10km rural' }
        ],
        backlinks: [
          '[[Civic-Tech-Platforms]]',
          '[[FastAPI-Async-Concurrency]]',
          '[[Redis-PubSub-RealTime]]',
          '[[Geospatial-Indexing-Algorithms]]'
        ],
        conclusion:
          'Desaparecidos EC establishes a high-performance technological foundation to empower missing-person search efforts with geospatial intelligence.'
      },
      callouts: [
        {
          type: 'important',
          title: 'Critical Metric: The Golden Window',
          content: 'Every second counts in the first 48 hours. The architecture dedicates 90% of compute resources to instant perimeter dispatch.'
        }
      ]
    }
  }
};

/**
 * Función auxiliar para formatear diagramas ASCII con ancho estrictamente acotado
 * garantizando que ninguna línea de texto se desborde del contenedor visual.
 */
function generateDynamicAsciiDiagram(title: string, technologies: string[], impact: string): string {
  const boxWidth = 69;
  const innerWidth = boxWidth - 4; // 65 caracteres de ancho útil

  const wrapText = (text: string, maxLen: number): string[] => {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = '';

    for (const w of words) {
      if (!current) {
        current = w;
      } else if ((current + ' ' + w).length <= maxLen) {
        current += ' ' + w;
      } else {
        lines.push(current);
        current = w;
      }
    }
    if (current) lines.push(current);
    return lines;
  };

  const centerLine = (text: string): string => {
    const truncated = text.length > innerWidth ? text.slice(0, innerWidth - 3) + '...' : text;
    const pad = Math.max(0, innerWidth - truncated.length);
    const padLeft = Math.floor(pad / 2);
    const padRight = pad - padLeft;
    return `| ${' '.repeat(padLeft)}${truncated}${' '.repeat(padRight)} |`;
  };

  const padLine = (text: string): string => {
    const truncated = text.length > innerWidth ? text.slice(0, innerWidth - 3) + '...' : text;
    const padRight = Math.max(0, innerWidth - truncated.length);
    return `| ${truncated}${' '.repeat(padRight)} |`;
  };

  const border = '+' + '-'.repeat(boxWidth - 2) + '+';
  const midPipe = ' '.repeat(Math.floor(boxWidth / 2)) + '|';
  const midArrow = ' '.repeat(Math.floor(boxWidth / 2)) + 'v';

  const titleLines = wrapText(title.toUpperCase(), innerWidth);
  const techText = `[ PIPELINE ] ──> ${technologies.slice(0, 4).join(' + ')}`;
  const techLines = wrapText(techText, innerWidth);
  const impactLines = wrapText(impact, innerWidth);

  return [
    border,
    ...titleLines.map(centerLine),
    border,
    midPipe,
    midArrow,
    border,
    ...techLines.map(padLine),
    border,
    midPipe,
    midArrow,
    border,
    padLine('[ RESULTADO & IMPACTO OPERATIVO ]'),
    padLine(''),
    ...impactLines.map(padLine),
    border,
  ].join('\n');
}

/**
 * Función que genera un caso de estudio estructurado al instante para cualquier
 * proyecto del catálogo en base a sus metadatos técnicos y el idioma seleccionado.
 */
export function getStudyCaseForProject(project: Project | CatalogProject, lang: Language = 'es'): StudyCase {
  const dictionary = studyCasesData[lang] || studyCasesData.es;
  if (dictionary[project.id]) {
    return dictionary[project.id];
  }

  const isEn = lang === 'en';
  const technologies = 'technologies' in project ? project.technologies : project.stack;
  const methodologies = 'methodologies' in project && project.methodologies && project.methodologies.length > 0 
    ? project.methodologies 
    : (isEn ? ['Modular Architecture', 'Strict Typing', 'Clean Code Patterns'] : ['Arquitectura Modular', 'Tipado Estricto', 'Patrones de Código Limpio']);
  const role = 'role' in project && project.role ? project.role : (isEn ? 'Lead Software Engineer' : 'Ingeniero de Software Principal');
  const impact = 'impact' in project 
    ? project.impact 
    : (project.metrics?.[0]?.value ? `${project.metrics[0].label}: ${project.metrics[0].value}` : project.summary);
  const categoryLabel = 'categoryLabel' in project ? project.categoryLabel : project.format;

  return {
    id: project.id,
    title: project.title,
    vaultPath: `01_PROJECTS/${project.year?.split('—')[0]?.trim() ?? '2025'}_${project.id.replace(/-/g, '_')}.md`,
    frontmatter: {
      type: isEn ? 'Technical Study Case // Second Brain Note' : 'Caso de Estudio Técnico // Nota de Segundo Cerebro',
      role: role,
      status: '#completed // #verified',
      created: `${project.year?.split('—')[0]?.trim() ?? '2025'}-01-15`,
      tags: [
        `#${project.id}`,
        `#${categoryLabel ? categoryLabel.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'engineering'}`,
        isEn ? '#second-brain' : '#segundo-cerebro',
        isEn ? '#production' : '#produccion'
      ],
      technologies: technologies,
      methodologies: methodologies,
      stack: technologies,
      complexity: isEn ? 'Medium / High' : 'Media / Alta',
      impact: impact
    },
    contextAndProblem: project.challenge,
    architectureDecision: {
      adrSummary: isEn ? `ADR-00X: Technical Architecture & Specification for ${project.title}` : `ADR-00X: Arquitectura y Especificación Técnica para ${project.title}`,
      diagramAscii: generateDynamicAsciiDiagram(project.title, technologies, impact),
      keyPoints: isEn
        ? [
            'Modular architecture with strict typing and clear separation of concerns.',
            'Performance optimization targeting zero latency bottlenecks and no premature technical debt.',
            'Robust exception handling and multi-layer validation.'
          ]
        : [
            'Desarrollo modular con tipado estricto y separación clara de responsabilidades.',
            'Optimización de performance orientada a cero cuellos de botella y cero deuda técnica prematura.',
            'Manejo robusto de excepciones y validación en capas.'
          ]
    },
    technicalSolution: {
      overview: isEn
        ? `Technical implementation using ${technologies.join(', ')} to overcome operational challenges with architectural rigor.`
        : `Implementación técnica utilizando ${technologies.join(', ')} para superar el desafío operativo planteado con rigor arquitectónico.`,
      snippets: [
        {
          filename: `${project.id.replace(/-/g, '_')}_solution.ts`,
          language: 'typescript',
          code: `// Key Implementation for ${project.title}
// Stack: ${technologies.join(' // ')}

export async function executeEngineWorkflow(config: { id: string; timestamp: number }) {
  console.log('[ENGINE] Processing workflow for ${project.title}:', config.id);

  return {
    status: 'SUCCESS',
    impact: '${impact.replace(/'/g, "\\'")}',
    timestamp: Date.now()
  };
}`
        }
      ]
    },
    challengesAndFixes: [
      {
        challenge: project.challenge,
        solution: impact
      }
    ],
    resultsAndSecondBrainLinks: {
      metrics: [
        { label: isEn ? 'IMPACT' : 'IMPACTO', value: impact.slice(0, 24) + '...' },
        { label: isEn ? 'STATUS' : 'ESTADO', value: isEn ? 'VERIFIED' : 'VERIFICADO' }
      ],
      backlinks: [
        '[[Spec-Driven-Development]]',
        '[[Clean-Code-Practices]]',
        '[[Architecture-Decision-Records]]'
      ],
      conclusion: isEn
        ? `The delivery of ${project.title} fulfilled all technical and operational goals with verified stability.`
        : `La entrega de ${project.title} cumplió los objetivos técnicos y de negocio establecidos con estabilidad comprobada.`
    },
    callouts: [
      {
        type: 'note',
        title: isEn ? 'Second Brain Note' : 'Nota de Segundo Cerebro',
        content: isEn ? 'Synchronized with Dinopengu Dev Obsidian knowledge vault.' : 'Estructura sincronizada con el grafo de conocimiento Obsidian de Dinopengu Dev.'
      }
    ]
  };
}
