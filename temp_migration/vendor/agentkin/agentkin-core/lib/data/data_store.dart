/// Abstract Data Store Interface
/// Supports decentralized Key-Value or Graph operations
abstract class DataStore {
  /// Unique identifier of the store (e.g., Peer ID)
  String get id;

  /// Put data at a specific path/key
  /// returns true if successful
  Future<bool> put(String path, dynamic data);

  /// Get data from a specific path/key
  Future<dynamic> get(String path);

  /// Subscribe to changes at a specific path
  Stream<dynamic> on(String path);

  /// Delete data at a specific path (tombstone)
  Future<bool> delete(String path);

  /// Initialize the P2P network connection
  Future<void> initialize(Map<String, dynamic> config);
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

