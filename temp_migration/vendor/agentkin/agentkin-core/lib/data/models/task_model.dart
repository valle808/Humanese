import 'dart:convert';

/// Task Status Enum
enum TaskStatus { open, claimed, inReview, completed, disputed }

/// Task Model
/// Represents a unit of work in the AgentKin economy.
class Task {
  final String id;
  final String title;
  final String description;
  final double budget;
  final String currency; // SOL, BTC, ETH, XRP, BNB, USD
  final TaskStatus status;
  final String ownerPub; // Public Key of the Boss (Agent)
  final String? workerPub; // Public Key of the Kin (Human)
  
  // Ghost Task Fields
  final bool isGhost;
  final String? encryptedData; // Stores title/desc if isGhost is true

  Task({
    required this.id,
    required this.title,
    required this.description,
    required this.budget,
    required this.currency,
    required this.status,
    required this.ownerPub,
    this.workerPub,
    this.isGhost = false,
    this.encryptedData,
  });

  /// Serialize to JSON (for GunDB/Storage)
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': isGhost ? null : title,
      'description': isGhost ? null : description,
      'budget': budget,
      'currency': currency,
      'status': status.toString().split('.').last,
      'ownerPub': ownerPub,
      'workerPub': workerPub,
      'isGhost': isGhost,
      'encryptedData': encryptedData,
    };
  }

  /// Deserialize from JSON
  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['id'],
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      budget: (json['budget'] as num).toDouble(),
      currency: json['currency'],
      status: TaskStatus.values.firstWhere(
        (e) => e.toString().split('.').last == json['status'],
        orElse: () => TaskStatus.open,
      ),
      ownerPub: json['ownerPub'],
      workerPub: json['workerPub'],
      isGhost: json['isGhost'] ?? false,
      encryptedData: json['encryptedData'],
    );
  }
}

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics

