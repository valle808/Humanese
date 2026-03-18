import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

class AntigravityBackgroundMobile extends StatefulWidget {
  const AntigravityBackgroundMobile({super.key});

  @override
  State<AntigravityBackgroundMobile> createState() => _AntigravityBackgroundMobileState();
}

class _AntigravityBackgroundMobileState extends State<AntigravityBackgroundMobile>
    with SingleTickerProviderStateMixin {
  late Ticker _ticker;
  final List<Particle> _particles = [];
  final Random _rnd = Random();
  final int _nodeCount = 35; // Slightly fewer for clean look
  final double _connectionDistance = 90.0;
  Size _size = Size.zero;

  @override
  void initState() {
    super.initState();
    _ticker = createTicker(_tick)..start();
  }

  void _initParticles(Size size) {
    _particles.clear();
    for (int i = 0; i < _nodeCount; i++) {
      _particles.add(Particle(
        x: _rnd.nextDouble() * size.width,
        y: _rnd.nextDouble() * size.height,
        vx: (_rnd.nextDouble() - 0.5) * 0.8,
        vy: (_rnd.nextDouble() - 0.5) * 0.8,
        size: _rnd.nextDouble() * 2 + 1,
      ));
    }
  }

  void _tick(Duration elapsed) {
    if (!mounted) return;
    setState(() {
      for (var p in _particles) {
        p.update(_size);
      }
    });
  }

  @override
  void dispose() {
    _ticker.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constraints) {
      if (_size != constraints.biggest) {
        _size = constraints.biggest;
        if (_size.width > 0) _initParticles(_size);
      }
      return CustomPaint(
        painter: AntigravityPainter(particles: _particles, connectionDist: _connectionDistance),
        size: Size.infinite,
      );
    });
  }
}

class Particle {
  double x;
  double y;
  double vx;
  double vy;
  double size;

  Particle({
      required this.x, 
      required this.y, 
      required this.vx, 
      required this.vy, 
      required this.size
  });

  void update(Size bounds) {
    x += vx;
    y += vy;

    if (x < 0 || x > bounds.width) vx *= -1;
    if (y < 0 || y > bounds.height) vy *= -1;
  }
}

class AntigravityPainter extends CustomPainter {
  final List<Particle> particles;
  final double connectionDist;

  AntigravityPainter({required this.particles, required this.connectionDist});

  @override
  void paint(Canvas canvas, Size size) {
    // Transparent background (Scaffold provides white/grey)
    // Or we can draw strict White if needed:
    // canvas.drawRect(Offset.zero & size, Paint()..color = Colors.white);

    final Paint particlePaint = Paint()..color = Colors.black.withOpacity(0.6);
    final Paint linePaint = Paint()
      ..strokeWidth = 0.5
      ..style = PaintingStyle.stroke;

    for (int i = 0; i < particles.length; i++) {
      final p1 = particles[i];
      canvas.drawCircle(Offset(p1.x, p1.y), p1.size, particlePaint);

      for (int j = i + 1; j < particles.length; j++) {
        final p2 = particles[j];
        final double dx = p1.x - p2.x;
        final double dy = p1.y - p2.y;
        final double dist = sqrt(dx * dx + dy * dy);

        if (dist < connectionDist) {
          final double opacity = (1.0 - (dist / connectionDist)) * 0.4; // Max 0.4 opacity lines
          linePaint.color = Colors.black.withOpacity(opacity);
          canvas.drawLine(Offset(p1.x, p1.y), Offset(p2.x, p2.y), linePaint);
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant AntigravityPainter oldDelegate) => true;
}

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
