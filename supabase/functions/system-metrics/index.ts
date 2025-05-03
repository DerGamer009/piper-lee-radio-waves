
// Follow Deno API reference: https://deno.land/api@v1.32.5
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface SystemMetrics {
  cpu: number;
  ram: number;
  disk: number;
  network: number;
  uptime: string;
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // In a real-world scenario, you would use system commands to get actual metrics
    // Since we're in an edge function environment, we'll simulate realistic metrics
    
    // Generate realistic metrics based on typical server patterns
    const currentHour = new Date().getHours();
    
    // CPU tends to be higher during business hours (8am-6pm)
    const cpuBaseline = currentHour >= 8 && currentHour <= 18 ? 30 : 15;
    const cpu = Math.max(5, Math.min(95, cpuBaseline + Math.floor(Math.random() * 25)));
    
    // RAM usage tends to grow during the day and reset after maintenance
    const ramBaseline = currentHour >= 8 && currentHour <= 22 ? 20 + (currentHour - 8) * 2 : 20;
    const ram = Math.max(15, Math.min(90, ramBaseline + Math.floor(Math.random() * 15)));
    
    // Disk usage grows slowly over time
    const diskBaseline = 75; // Assuming it's quite full
    const disk = Math.max(50, Math.min(95, diskBaseline + Math.floor(Math.random() * 5)));
    
    // Network usage spikes during peak times
    const networkBaseline = currentHour >= 8 && currentHour <= 18 ? 25 : 10;
    const network = Math.max(5, Math.min(90, networkBaseline + Math.floor(Math.random() * 20)));
    
    // Calculate a realistic uptime string
    const days = Math.floor(Math.random() * 10) + 1;
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const uptime = `${days}d ${hours}h ${minutes}m`;
    
    const metrics: SystemMetrics = {
      cpu,
      ram,
      disk,
      network,
      uptime,
      timestamp: new Date().toISOString()
    };

    // Also add system services status
    const services = [
      { name: 'Webserver', status: Math.random() > 0.05 ? 'online' : 'warning', message: Math.random() > 0.8 ? 'Hohe Latenz' : null },
      { name: 'Datenbank', status: Math.random() > 0.07 ? 'online' : 'warning', message: Math.random() > 0.9 ? 'Hohe Auslastung' : null },
      { name: 'Stream Server', status: Math.random() > 0.1 ? 'online' : 'warning', message: Math.random() > 0.85 ? 'Buffer-Überlauf' : null },
      { name: 'Cache Server', status: Math.random() > 0.03 ? 'online' : 'warning', message: Math.random() > 0.95 ? 'Cache voll' : null },
      { name: 'Media Storage', status: disk > 85 ? 'warning' : 'online', message: disk > 85 ? `Fast voll (${disk}%)` : null },
    ];

    // Add some recent logs
    const logLevels = ['info', 'warning', 'error'];
    const logMessages = [
      'Nutzer hat sich angemeldet',
      'Festplattenspeicher fast voll',
      'Backup erfolgreich abgeschlossen',
      'System-Update verfügbar',
      'Fehlgeschlagener Login-Versuch',
      'Datenbank-Optimierung durchgeführt',
      'Cache geleert',
      'Hohe CPU-Auslastung',
      'Netzwerk-Timeout aufgetreten',
      'Systemneustart geplant',
      'Dienst neu gestartet',
      'Firewall hat verdächtige Aktivität blockiert',
    ];

    const logs = Array(10).fill(null).map(() => {
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      const second = Math.floor(Math.random() * 60);
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
      const level = logLevels[Math.floor(Math.random() * logLevels.length)];
      const message = logMessages[Math.floor(Math.random() * logMessages.length)];
      
      return {
        time,
        level,
        message
      };
    }).sort((a, b) => a.time.localeCompare(b.time));

    return new Response(
      JSON.stringify({
        metrics,
        services,
        logs
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
