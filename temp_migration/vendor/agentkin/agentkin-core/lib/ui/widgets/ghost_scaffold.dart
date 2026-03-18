import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../logic/ghost_state.dart';
import 'alien_background_mobile.dart';
import 'antigravity_background_mobile.dart';

class GhostScaffold extends ConsumerWidget {
  final Widget body;
  final AppBar? appBar;
  final Widget? floatingActionButton;
  final Widget? drawer;

  const GhostScaffold({
    super.key,
    required this.body,
    this.appBar,
    this.floatingActionButton,
    this.drawer,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isGhostMode = ref.watch(ghostModeProvider);

    return Scaffold(
      extendBodyBehindAppBar: isGhostMode, // Allow body to go behind app bar
      appBar: appBar != null ? 
        (isGhostMode ? _buildGhostAppBar(appBar!) : appBar) 
        : null,
      drawer: drawer,
      floatingActionButton: floatingActionButton,
      backgroundColor: isGhostMode ? Colors.transparent : null,
      body: Stack(
        children: [
          if (isGhostMode) const Positioned.fill(child: AlienBackgroundMobile()),
          SafeArea(
             top: !isGhostMode, // Look out for overlap
             child: body
          ),
        ],
      ),
    );
  }

  PreferredSizeWidget _buildGhostAppBar(AppBar original) {
    return AppBar(
      title: original.title,
      actions: original.actions,
      backgroundColor: Colors.transparent,
      elevation: 0,
      iconTheme: const IconThemeData(color: Colors.greenAccent),
      titleTextStyle: const TextStyle(color: Colors.greenAccent, fontSize: 20, fontWeight: FontWeight.bold),
    );
  }
}

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics

