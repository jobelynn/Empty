package com.abjjrs.stressapp.ui.home

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ProgressBar
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.abjjrs.stressapp.R
import com.abjjrs.stressapp.SessionData
import com.abjjrs.stressapp.databinding.FragmentHomeBinding
import com.abjjrs.stressapp.network.performAuthRequest
import com.abjjrs.stressapp.network.performGetAccessToken
import com.abjjrs.stressapp.network.performGetRealtimeStress
import com.abjjrs.stressapp.ui.weeklyreport.WeeklyReportActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val homeViewModel =
            ViewModelProvider(this).get(HomeViewModel::class.java)

        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        val root: View = binding.root

        val textView: TextView = binding.welcomeText
        homeViewModel.text.observe(viewLifecycleOwner) {
            textView.text = it
        }
        val stressIndexTextView: TextView = root.findViewById(R.id.stress_index)
        homeViewModel.stressIndex.observe(viewLifecycleOwner) { newIndex ->
            stressIndexTextView.text = newIndex
            updateSuggestion(newIndex.toDouble())
        }

        val progressBar: ProgressBar = root.findViewById(R.id.progressBar)
        homeViewModel.progress.observe(viewLifecycleOwner) { newProgress ->
            progressBar.progress = newProgress
        }
        // Setting a listener for weekly report button

        val weeklyReportButton: Button = root.findViewById(R.id.weekly_report_button)
        weeklyReportButton.setOnClickListener {
            // Redirect to WeeklyReportActivity
            val intent = Intent(requireContext(), WeeklyReportActivity::class.java)
            startActivity(intent)
        }
        // Sample data test
        val userId = SessionData.userId
        if (userId != null) {
            CoroutineScope(Dispatchers.Main).launch {
                performGetAccessToken(requireContext(), userId)
            }
        }
        val accessToken = SessionData.accessToken
        println("userId: $userId")
        println("accessToken: $accessToken")
        if (userId != null && accessToken != null) {
            println("Getting realtime stress")
            CoroutineScope(Dispatchers.Main).launch {
                performGetRealtimeStress(userId, accessToken) { stressIndex ->
                    var newProgress: Int? = stressIndex?.toInt()?.times(100)
                    homeViewModel.updateStressIndex(stressIndex.toString(), 80) //Modify
                    println("Stress index is: $stressIndex")
                }
            }
            println("Finished getting realtime stress")
        }


        return root
    }

    private fun updateSuggestion(stressIndex: Double) {
        val suggestionTextView: TextView = binding.suggestionText
        val link = when (stressIndex) {
            in 0.0..0.7 -> {
                suggestionTextView.text = "You're doing well! Consider these relaxation techniques."
                "provide link"
            }
            in 0.7..0.9 -> {
                suggestionTextView.text = "You might need to unwind. Try these stress management tips."
                "provide link"
            }
            else -> {
                suggestionTextView.text = "It's important to seek help. Here are some resources."
                "provide link"
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}