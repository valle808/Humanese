import 'dart:convert';
import '../data/data_store.dart';
import '../data/models/task_model.dart';
import '../data/encryption.dart';

class TaskManager {
  final DataStore _dataStore;
  final String _platformWallet = 'E1pAENVbtiwoktgjvMKhUEhDUGcYCMQ4cCGwDruruzTL'; // Default SOL

  TaskManager(this._dataStore);

  /// Creates a standard public task
  Future<Task> createTask({
    required String title,
    required String description,
    required double budget,
    required String currency,
    required String ownerPub,
  }) async {
    // 1. Calculate Fees (3% Creation Fee)
    final double fee = budget * 0.03;
    final double totalCost = budget + fee;

    print('Creating Task: "$title" | Budget: $budget | Fee: $fee | Total: $totalCost');
    
    // TODO: Verify on-chain payment of `totalCost` to specific vault

    final task = Task(
      id: DateTime.now().millisecondsSinceEpoch.toString(), // Simple ID for now
      title: title,
      description: description,
      budget: budget,
      currency: currency,
      status: TaskStatus.open,
      ownerPub: ownerPub,
    );

    await _dataStore.put('tasks/${task.id}', task.toJson());
    return task;
  }

  /// Creates a "Ghost Task" (Secret Mode)
  Future<Task> createGhostTask({
    required String title,
    required String description,
    required double budget,
    required String currency,
    required String ownerPub,
    required String sharedKey, // AES Key shared via ECDH
  }) async {
    // Encrypt sensitive fields
    final sensitiveData = jsonEncode({'title': title, 'description': description});
    final encrypted = EncryptionService.encryptData(sensitiveData, sharedKey);

    final task = Task(
      id: 'ghost-${DateTime.now().millisecondsSinceEpoch}',
      title: 'Ghost Task', // Public placeholder
      description: 'Encrypted Content', // Public placeholder
      budget: budget,
      currency: currency,
      status: TaskStatus.open,
      ownerPub: ownerPub,
      isGhost: true,
      encryptedData: encrypted,
    );

    await _dataStore.put('tasks/${task.id}', task.toJson());
    return task;
  }

  /// Subscribes to task updates
  Stream<Task> watchTask(String taskId) {
    return _dataStore.on('tasks/$taskId').map((data) => Task.fromJson(data));
  }
}

//   ____                    _         _                
//  / ___|_ __ ___  __ _  __| | ___   | |__  _   _      
// | |   | '__/ _ \/ _` |/ _` |/ _ \  | '_ \| | | |     
// | |___| | |  __/ (_| | (_| | (_) | | |_) | |_| |     
//  \____|_|  \___|\__,_|\__,_|\___/  |_.__/ \__, |     
//  ____                 _        __     __  |___/      
// / ___|  ___ _ __ __ _(_) ___   \ \   / /_ _| | | ___ 
// \___ \ / _ \ '__/ _` | |/ _ \   \ \ / / _` | | |/ _ \
//  ___) |  __/ | | (_| | | (_) |   \ V / (_| | | |  __/
// |____/ \___|_|  \__, |_|\___/     \_/ \__,_|_|_|\___|
//                 |___/    
//
// Sergiio Valle Bastidas - valle808@hawaii.edu
// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics

