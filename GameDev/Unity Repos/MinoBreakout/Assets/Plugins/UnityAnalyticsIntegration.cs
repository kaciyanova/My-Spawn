using UnityEngine;
using System.Collections;
using UnityEngine.Cloud.Analytics;

public class UnityAnalyticsIntegration : MonoBehaviour {
	
	// Use this for initialization
	void Start () {
		
		const string projectId = "fe8342cb-d92e-4b03-a5e9-676c168a621b";
		UnityAnalytics.StartSDK (projectId);
		
	}
	
}