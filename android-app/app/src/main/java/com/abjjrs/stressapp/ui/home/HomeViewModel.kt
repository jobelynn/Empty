package com.abjjrs.stressapp.ui.home

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class HomeViewModel : ViewModel() {

    // Existing text LiveData
    private val text_ = MutableLiveData<String>().apply {
        //value = "This is home Fragment"
    }
    val text: LiveData<String> = text_

    private val _stressIndex = MutableLiveData<String>().apply {
        value = "0.7"  // Initial value
    }
    val stressIndex: LiveData<String> = _stressIndex

    private val _progress = MutableLiveData<Int>().apply {
        value = 70
    }
    val progress: LiveData<Int> = _progress

    // Call this to update stress index and progress bar on home page
    fun updateStressIndex(newIndex: String, newProgress: Int) {
        _stressIndex.value = newIndex
        _progress.value = newProgress
    }
}