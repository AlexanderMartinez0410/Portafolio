import type { StudyCase } from '../../types';

export const desaparecidosEcEs: StudyCase = {
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
};

export const desaparecidosEcEn: StudyCase = {
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
};
