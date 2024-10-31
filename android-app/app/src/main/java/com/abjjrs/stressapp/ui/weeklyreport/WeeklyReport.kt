package com.abjjrs.stressapp.ui.weeklyreport


import android.graphics.Color
import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.abjjrs.stressapp.R
import androidx.activity.viewModels
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.components.AxisBase
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import com.github.mikephil.charting.formatter.ValueFormatter

class WeeklyReportActivity : AppCompatActivity() {
    private val viewModel: WeeklyReportViewModel by viewModels()
    private lateinit var lineChart: LineChart
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.weekly_report)
        lineChart = findViewById(R.id.lineChart)

        viewModel.stressData.observe(this) { data ->
            updateChart(data)
        }
//        viewModel.averageStressLevel.observe(this) { averageLevel ->
//            findViewById<TextView>(R.id.textView18).text = String.format("%.2f", averageLevel)
//        }
        viewModel.heartRateData.observe(this) { heartRateData ->
            findViewById<TextView>(R.id.textView14).text = String.format("%.0f", heartRateData.average())
        }
        viewModel.hrvData.observe(this) { hrvData ->
            findViewById<TextView>(R.id.textView16).text = String.format("%.0f", hrvData.average())
        }
        viewModel.stressData.observe(this) { stressData ->
            findViewById<TextView>(R.id.textView17).text = String.format("%.2f", stressData.average())
        }


        // Load data
        viewModel.loadStressData()
    }

    private fun updateChart(data: List<Float>) {
        // Create a list of Entry objects from the provided data
        val entries = data.mapIndexed { index, value -> Entry(index.toFloat(), value) }

        // Create a LineDataSet with the entries
        val lineDataSet = LineDataSet(entries, "Stress Levels").apply {
            color = Color.BLUE
            valueTextColor = Color.BLACK
        }

        // Creating LineData OBJECT
        val lineData = LineData(lineDataSet)

        lineChart.data = lineData

        // Edit Y-axis
        lineChart.axisLeft.axisMinimum = 0f
        lineChart.axisLeft.axisMaximum = 1f // This sets the range to 1
        lineChart.axisRight.isEnabled = false // Disable all other axis

        // Edit X-axis
        lineChart.xAxis.valueFormatter = object : ValueFormatter() {
            override fun getAxisLabel(value: Float, axis: AxisBase?): String {
                return when (value.toInt()) {
                    0 -> "Sun"
                    1 -> "Mon"
                    2 -> "Tue"
                    3 -> "Wed"
                    4 -> "Thu"
                    5 -> "Fri"
                    6 -> "Sat"
                    else -> ""
                }
            }
        }
        lineChart.xAxis.granularity = 1f
        lineChart.xAxis.labelCount = 7 // seven labels needed

        // Refresh the chart
        lineChart.invalidate()

        // instead of back button might bind the app's footer
    }
}